const xml = require('xml2js');
const request = require('request-promise');
const Promise = require('bluebird');
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

module.exports.purchaseCC = (data) => {
  if (!config || !config.store_id || !config.api_token) {
    return Promise.reject(new Error('configuration not initialized'));
  }
  const pan = cleanse(data.card, true);
  // Moneris takes expiry date format YY/MM, however most websites use the MM/YY format, you can specify this in a verbose manner in the configuration by setting configuration.expiryFormat = 'MM/YY'; or the default 'YY/MM';
  const expdate = normalizeExpiry(config.expiryFormat, cleanse(data.expiry, true));
  let { amount } = data;
  // Moneris is super picky about formatting..
  if (data.forceDecline && config.test) {
    amount = 0.05;
  }
  amount = (amount ? numeral(amount).format('0.00') : false);
  const suffix = `${(new Date()).getTime()}-${Math.ceil(Math.random() * 10000)}`;
  /* eslint-disable camelcase */
  const order_id = data.order_id || `${cleanse(config.app_name, true)}-Purchase-${suffix}`;
  const cust_id = data.cust_id || `customer-${suffix}`;
  const dynamic_descriptor = data.description || data.dynamic_descriptor || 'purchase';
  /* eslint-enable camelcase */
  const req = {
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
  const body = {
    store_id: config.store_id,
    api_token: config.api_token,
  };
  if (req.type === 'attribute_query' || req.type === 'session_query') {
    body.risk = {};
    body.risk[req.type] = req;
  } else {
    body[req.type] = req;
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
    body: xmlBuilder.buildObject(body),
    headers: {
      'User-Agent': globals.API_VERSION,
    },
    timeout: globals.CLIENT_TIMEOUT * 1000,
  };
  return request(options)
    .then(res => xml.parseStringAsync(res))
    .then(res => (Array.isArray(res.response.receipt) ? res.response.receipt[0] : res.response.receipt))
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
      if (approved) {
        return status;
      }
      return {
        code: status.code,
        msg: (status.timeout ? 'TIMEOUT' : status.msg) || 'DECLINED',
        raw: result,
      };
    });
};
