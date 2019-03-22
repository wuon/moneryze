const xml = require('xml2js');
const request = require('request-promise');
const Promise = require('bluebird');
const $q = require('q');// yes using two promise libraries, but will replace bluebird with q soon.
const numeral = require('numeral');

Promise.promisifyAll(xml);

const globals = require('./constants/globals.json');

const xmlBuilder = new xml.Builder();
xmlBuilder.options.rootName = 'request';

let config;

const cleanse = (str, spaces) => {
  let s = str;
  if (spaces) {
    s = String(s).split(' ').join('');
  }
  return (s ? String(s).split('/').join('').split('=')
    .join('')
    .split('*')
    .join('')
    .split('!')
    .join('')
    .split('-')
    .join('')
    .trim() : '');
};

// Check out https://developer.moneris.com/More/Testing/Penny%20Value%20Simulator, for more "magic" amounts to force different responses.
/* eslint-disable-next-line no-nested-ternary */
const firstElement = (arr, assertion) => (Array.isArray(arr) && arr.length > 0
  && arr[0] ? (assertion ? arr[0] === assertion : arr[0]) : null);

const normalizeExpiry = (format, expiry) => {
  if (typeof format === 'string' && format.toLowerCase().split('/').join('') === 'mmyy') {
    return expiry.toString().split('').slice(2, 4).join('') + expiry.toString().split('').slice(0, 2).join('');
  }
  return expiry;
};

const purchaseCC = (req, extended = null) => {
  if (!config || !req || !req.type || !config.store_id || !config.api_token) {
    return Promise.reject(new TypeError('Requires country_code, store_id, api_token'));
  }
  const data = {
    store_id: config.store_id,
    api_token: config.api_token,
  };
  if (req.type === 'attribute_query' || req.type === 'session_query') {
    data.risk = {};
    data.risk[req.type] = req;
  } else {
    data[req.type] = req;
  }
  if (extended) {
    Object.keys(extended).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(extended, key) && !Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = extended[key];
      }
    });
  }
  let prefix = '';
  if (!!config.country_code && config.country_code !== 'CA') {
    prefix += `${config.country_code}_`;
  }
  let hostPrefix = prefix;
  let filePrefix = prefix;
  if (config.test) {
    hostPrefix += 'TEST_';
  }
  if (req.type === 'acs' || req.type === 'txn') {
    filePrefix += 'MPI_';
  }
  const options = {
    uri: `${globals.PROTOCOL}://${globals[`${hostPrefix}HOST`]}:${globals.PORT}${globals[`${filePrefix}FILE`]}`,
    method: 'POST',
    body: xmlBuilder.buildObject(data),
    headers: {
      'User-Agent': globals.API_VERSION,
    },
    timeout: globals.CLIENT_TIMEOUT * 1000,
  };
  return request(options)
    .then(res => xml.parseStringAsync(res))
    .then(res => (Array.isArray(res.response.receipt) ? res.response.receipt[0] : res.response.receipt));
};

module.exports.init = (configuration) => {
  config = configuration;
  if (config.country_code) {
    config.country_code = config.country_code.toUpperCase();
    if (config.country_code !== 'CA'
      && !Object.prototype.hasOwnProperty.call(globals, `${config.country_code}_HOST`)) {
      return Promise.reject(new TypeError('Invalid country code'));
    }
  }
  return Promise.resolve();
};

module.exports.pay = (args) => {
  const pan = cleanse(args.card, true);
  // Moneris takes expiry date format YY/MM, however most websites use the MM/YY format, you can specify this in a verbose manner in the configuration by setting configuration.expiryFormat = 'MM/YY'; or the default 'YY/MM';
  const expdate = normalizeExpiry(config.expiryFormat, cleanse(args.expiry, true));
  let { amount } = args;
  // Moneris is super picky about formatting..
  if (args.forceDecline && config.test) {
    amount = 0.05;
  }
  amount = (amount ? numeral(amount).format('0.00') : false);
  const suffix = `${(new Date()).getTime()}-${Math.ceil(Math.random() * 10000)}`;
  /* eslint-disable camelcase */
  const order_id = args.order_id || `${cleanse(config.app_name, true)}-Purchase-${suffix}`;
  const cust_id = args.cust_id || `customer-${suffix}`;
  const dynamic_descriptor = args.description || args.dynamic_descriptor || 'purchase';
  /* eslint-enable camelcase */
  const purchase = {
    type: 'purchase',
    cust_id,
    order_id,
    amount,
    pan,
    expdate,
    crypt_type: 7,
    dynamic_descriptor,
    status_check: false,
  };
  return $q.fcall(() => {
    if (!amount || !pan || !expdate) {
      throw {
        code: null,
        msg: 'INVALID_INPUTS',
      };
    }
    return purchaseCC(purchase)
      .then((result) => {
        console.log(result);
        const fe = firstElement; // shorthand
        const code = fe(result.ResponseCode);
        const status = {
          msg: cleanse(fe(result.Message)),
          code,
          reference: fe(result.ReferenceNum),
          iso: fe(result.ISO),
          receipt: fe(result.ReceiptId),
          raw: result,
          isVisa: fe(result.CardType, 'V'),
          isMasterCard: fe(result.CardType, 'M'),
          isVisaDebit: fe(result.IsVisaDebit, 'true'),
          authCode: fe(result.AuthCode),
          timeout: fe(result.TimedOut, 'true'),
          date: fe(result.TransDate),
          time: fe(result.TransTime),
          custId: cust_id,
          orderId: order_id,
        };
        const approved = !status.timeout && ((code) === '00' || code ? parseInt(code, 10) < 50 : false);
        return $q.fcall(() => {
          if (approved) {
            return status;
          }
          throw {
            code: status.code,
            msg: (status.timeout ? 'TIMEOUT' : status.msg) || 'DECLINED',
            raw: result,
          };
        });
      });
  });
};
