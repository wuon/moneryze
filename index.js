const xml = require('xml2js');
const Promise = require('bluebird');
const axios = require('axios');
const { camelCase } = require('change-case');

Promise.promisifyAll(xml);

const globals = require('./constants/globals.json');

const xmlBuilder = new xml.Builder();
xmlBuilder.options.rootName = 'request';

let config = {
  app_name: 'moneryze',
  store_id: 'store5', // CVD & AVS only works with store5
  api_token: 'yesguy',
  crypt_type: '7',
  test: true,
};

const filter = new Set(['res_lookup_masked', 'res_delete', 'completion', 'res_update_cc']);
const sudo = new Set(['res_lookup_masked']);

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
    .trim() : '')
    .replace(/\s+/g, ' ');
};

/* eslint-disable-next-line no-nested-ternary */
const fe = (arr, assertion) => (Array.isArray(arr) && arr.length > 0 && arr[0] !== 'null'
      && arr[0] ? (assertion ? arr[0] === assertion : arr[0]) : null);

const normalizeExpiry = (format, expiry) => {
  if (typeof format === 'string' && format.toLowerCase().split('/').join('') === 'mmyy') {
    return expiry.toString().split('').slice(2, 4).join('') + expiry.toString().split('').slice(0, 2).join('');
  }
  return expiry;
};

const format = (data, sanitize = true) => {
  const o = {};
  const reference = fe(data.ReferenceNum);
  const dataKey = fe(data.DataKey);
  const iso = fe(data.ISO);
  const receipt = fe(data.ReceiptId);
  const avsResultCode = fe(data.AvsResultCode);
  const cvdResultCode = fe(data.CvdResultCode);
  const isVisa = fe(data.CardType, 'V');
  const isMasterCard = fe(data.CardType, 'M');
  const isVisaDebit = fe(data.IsVisaDebit, 'true');
  const code = fe(data.ResponseCode);
  const authCode = fe(data.AuthCode);
  const date = fe(data.TransDate);
  const time = fe(data.TransTime);
  const amount = fe(data.TransAmount);
  const id = fe(data.TransID);
  const type = fe(data.TransType);
  const isComplete = fe(data.Complete, 'true');
  const payment = fe(data.PaymentType);
  const resSuccess = fe(data.ResSuccess, 'true');
  const corporateCard = fe(data.CorporateCard, 'true');
  const recurSuccess = fe(data.RecurSuccess, 'true');
  const resolveData = fe(data.ResolveData);
  const maskedPan = resolveData ? fe(resolveData.masked_pan) : null;
  const kountInfo = fe(data.KountInfo);
  const kountResult = fe(data.KountResult);
  const kountScore = fe(data.KountScore);
  const kountTransactionId = fe(data.KountTransactionId);

  if (reference && reference !== 'null') {
    o.reference = reference;
  }
  if (dataKey && dataKey !== 'null') {
    o.dataKey = dataKey;
  }
  if (iso && iso !== 'null') {
    o.iso = iso;
  }
  if (receipt && receipt !== 'null') {
    o.receipt = receipt;
  }
  if (avsResultCode) {
    o.avsResultCode = avsResultCode;
  }
  if (cvdResultCode !== null && cvdResultCode !== 'null') {
    o.cvdResultCode = cvdResultCode;
  }
  if (isVisa !== null && isVisa !== 'null') {
    o.isVisa = isVisa;
  }
  if (isMasterCard !== null && isMasterCard !== 'null') {
    o.isMasterCard = isMasterCard;
  }
  if (isVisaDebit !== null && isVisaDebit !== 'null') {
    o.isVisaDebit = isVisaDebit;
  }
  if (authCode && authCode !== 'null') {
    o.authCode = authCode;
  }
  if (date && date !== 'null') {
    o.date = date;
  }
  if (time && time !== 'null') {
    o.time = time;
  }
  if (isComplete !== null && isComplete !== 'null') {
    o.isComplete = isComplete;
  }
  if (payment && payment !== 'null') {
    o.payment = payment;
  }
  if (resSuccess !== null && resSuccess !== 'null') {
    o.resSuccess = resSuccess;
  }
  if (recurSuccess !== null && recurSuccess !== 'null') {
    o.recurSuccess = recurSuccess;
  }
  if (corporateCard !== null && corporateCard !== 'null') {
    o.corporateCard = corporateCard;
  }
  if (amount && amount !== 'null') {
    o.amount = amount;
  }
  if (id && id !== 'null') {
    o.id = id;
  }
  if (type && type !== 'null') {
    o.type = type;
  }
  if (maskedPan && maskedPan !== 'null' && !sanitize) {
    o.maskedPan = maskedPan;
  }

  if (kountInfo && kountInfo !== 'null') {
    o.kountInfo = Object.keys(kountInfo).reduce((total, current) => {
      const newTotal = { ...total };
      newTotal[camelCase(current)] = kountInfo[current].pop();
      return newTotal;
    }, {});
  }
  if (kountResult && kountResult !== 'null') {
    o.kountResult = kountResult;
  }
  if (kountScore && kountScore !== 'null') {
    o.kountScore = kountScore;
  }
  if (kountTransactionId && kountTransactionId !== 'null') {
    o.kountTransactionId = kountTransactionId;
  }

  return {
    isSuccess: !fe(data.TimedOut, 'true') && ((code) === '00' || code ? parseInt(code, 10) < 50 : false),
    code,
    msg: (o.timeout ? 'TIMEOUT' : cleanse(fe(data.Message))) || 'ERROR',
    data: o,
  };
};

const send = async (data, type, configuration) => {
  if (!configuration || !configuration.store_id || !configuration.api_token) {
    return Promise.reject(new Error('configuration not initialized'));
  }
  const suffix = `${(new Date()).getTime()}-${Math.ceil(Math.random() * 10000)}`;
  const out = data;
  if (!filter.has(type)) {
    out.crypt_type = data.crypt_type || configuration.crypt_type;
    out.order_id = out.order_id || `${cleanse(configuration.name, true)}-Purchase-${suffix}`;
  }
  if (configuration.test && out.test) {
    out.amount = 0.05;
    delete out.test;
  }
  if (out.pan) {
    out.pan = cleanse(data.pan, true);
  }
  if (out.expdate) {
    out.expdate = normalizeExpiry(configuration.expiryFormat, cleanse(data.expdate, true));
  }
  if (out.description) {
    out.dynamic_descriptor = out.description || out.dynamic_descriptor || type;
    delete out.description;
  }
  if (out.token) {
    out.data_key = out.token;
    delete out.token;
  }
  if (out.cvd_info) {
    out.cvd_info = out.cvd_info;
  }
  if (out.avs_info) {
    out.avs_info = out.avs_info;
  }

  if (type === 'kount_inquiry') {
    // default values for email and ANID when they weren't specified in payload
    if (!out.email) {
      out.email = 'noemail@kount.com';
    }
    if (!out.auto_number_id) {
      out.auto_number_id = '0123456789';
    }
  }

  const body = {
    store_id: configuration.store_id,
    api_token: configuration.api_token,
  };
  if (type === 'attribute_query' || type === 'session_query') {
    body.risk = {};
    body.risk[type] = out;
  } else {
    body[type] = out;
  }
  let prefix = '';
  if (!!configuration.country_code && config.country_code !== 'CA') {
    prefix += `${config.country_code}_`;
  }
  let hostPrefix = prefix;
  let filePrefix = prefix;

  if (configuration.test !== undefined || configuration.test !== null) {
    config.test = configuration.test;
  }
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
  return format(receipt, !sudo.has(type));
};

module.exports.init = (configuration) => {
  if (configuration.store_id && configuration.api_token) {
    config = configuration;
    if (!config.crypt_type) {
      config.crypt_type = '7';
    }
    if (!config.name) {
      config.name = 'default';
    }
    if (config.country_code) {
      config.country_code = config.country_code.toUpperCase();
      if (config.country_code !== 'CA'
        && !Object.prototype.hasOwnProperty.call(globals, `${config.country_code}_HOST`)) {
        return Promise.reject(new Error('Invalid country code. CA, US is only supported.'));
      }
    }
    return Promise.resolve(config);
  }
  return Promise.reject(new Error('store_id and api_token are required.'));
};

module.exports.resAddCC = (data, configuration = config) => send(data, 'res_add_cc', configuration);
module.exports.resDelete = (data, configuration = config) => send(data, 'res_delete', configuration);
module.exports.resUpdateCC = (data, configuration = config) => send(data, 'res_update_cc', configuration);
module.exports.resPurchaseCC = (data, configuration = config) => send(data, 'res_purchase_cc', configuration);
module.exports.resPreauthCC = (data, configuration = config) => send(data, 'res_preauth_cc', configuration);
module.exports.resLookupMasked = (data, configuration = config) => send(data, 'res_lookup_masked', configuration);
module.exports.completion = (data, configuration = config) => send(data, 'completion', configuration);
module.exports.purchase = (data, configuration = config) => send(data, 'purchase', configuration);
module.exports.refund = (data, configuration = config) => send(data, 'refund', configuration);
module.exports.preauth = (data, configuration = config) => send(data, 'preauth', configuration);
module.exports.independentRefundWithVault = (data, configuration = config) => send(data, 'res_ind_refund_cc', configuration);
module.exports.kountInquire = (data, configuration = config) => send(data, 'kount_inquiry', configuration);
module.exports.kountUpdate = (data, configuration = config) => send(data, 'kount_update', configuration);
