const xml = require('xml2js');
const Promise = require('bluebird');
const numeral = require('numeral');
const axios = require('axios');

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

/* eslint-disable-next-line no-nested-ternary */
const firstElement = (arr, assertion) => (Array.isArray(arr) && arr.length > 0
  && arr[0] ? (assertion ? arr[0] === assertion : arr[0]) : null);

const normalizeExpiry = (format, expiry) => {
  if (typeof format === 'string' && format.toLowerCase().split('/').join('') === 'mmyy') {
    return expiry.toString().split('').slice(2, 4).join('') + expiry.toString().split('').slice(0, 2).join('');
  }
  return expiry;
};

const format = (data) => {
  const fe = firstElement; // shorthand
  const code = fe(data.ResponseCode);
  const status = {
    msg: cleanse(fe(data.Message)),
    code,
    reference: fe(data.ReferenceNum),
    iso: fe(data.ISO),
    receipt: fe(data.ReceiptId),
    isVisa: fe(data.CardType, 'V'),
    isMasterCard: fe(data.CardType, 'M'),
    isVisaDebit: fe(data.IsVisaDebit, 'true'),
    authCode: fe(data.AuthCode),
    timeout: fe(data.TimedOut, 'true'),
    date: fe(data.TransDate),
    time: fe(data.TransTime),
    dataKey: fe(data.DataKey),
  };
  const approved = !status.timeout && ((code) === '00' || code ? parseInt(code, 10) < 50 : false);
  if (approved) {
    return status;
  }
  return {
    code: status.code,
    msg: (status.timeout ? 'TIMEOUT' : status.msg) || 'DECLINED',
    raw: data,
  };
};

const send = async (data, type) => {
  if (!config || !config.store_id || !config.api_token) {
    return Promise.reject(new Error('configuration not initialized'));
  }
  const out = {};
  out.crypt_type = data.crypt_type || config.crypt_type;
  if (data.pan) {
    out.pan = cleanse(data.pan, true);
  }
  if (data.expdate) {
    out.expdate = normalizeExpiry(config.expiryFormat, cleanse(data.expdate, true));
  }
  const body = {
    store_id: config.store_id,
    api_token: config.api_token,
  };
  if (type === 'attribute_query' || type === 'session_query') {
    body.risk = {};
    body.risk[type] = out;
  } else {
    body[type] = out;
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
  if (type === 'acs' || type === 'txn') {
    filePrefix += 'MPI_';
  }
  const options = {
    url: `${globals.PROTOCOL}://${globals[`${hostPrefix}HOST`]}:${globals.PORT}${globals[`${filePrefix}FILE`]}`,
    method: 'POST',
    data: xmlBuilder.buildObject(body),
    headers: {
      'USER-AGENT': globals.API_VERSION,
      'CONTENT-TYPE': 'text/xml',
    },
    timeout: globals.CLIENT_TIMEOUT * 1000,
  };
  const response = await axios(options);
  const xmlify = await xml.parseStringAsync(response.data);
  const receipt = Array.isArray(xmlify.response.receipt) ? xmlify.response.receipt[0] : xmlify.response.receipt;
  return format(receipt);
};

module.exports.init = (configuration) => {
  config = configuration;
  if (config.crypt_type === null) {
    config.crypt_type = 7;
  }
  if (config.country_code) {
    config.country_code = config.country_code.toUpperCase();
    if (config.country_code !== 'CA'
      && !Object.prototype.hasOwnProperty.call(globals, `${config.country_code}_HOST`)) {
      return Promise.reject(new Error('Invalid country code. CA is only supported.'));
    }
  }
  return Promise.resolve();
};

module.exports.resAddCC = data => send(data, 'res_add_cc');
