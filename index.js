'use strict'

// Imports
const xml = require('xml2js')
const request = require('request-promise')
const Promise = require('bluebird');
var $q = require('q');//yes using two promise libraries, but will replace bluebird with q soon.
const numeral = require('numeral');
Promise.promisifyAll(xml)

// Globals (from Moneris PHP API)
const globals = require('./constants/globals.json')

// Intermediaries
const xmlBuilder = new xml.Builder()
xmlBuilder.options.rootName = 'request';

//--
var cleanse = function(str,spaces){
  if(spaces){
    str = String(str).split(' ').join('');
  }
  return (str ? String(str).split('/').join('').split('=').join('').split('*').join('').split('!').join('').split('-').join('').trim() : '');
};
module.exports = function(configuration){
  function send (req, extended) {
    if(extended === undefined) {
      extended = null;
    }
    if (!configuration || !req || !req.type || !configuration.store_id || !configuration.api_token) {
      return Promise.reject(new TypeError('Requires country_code, store_id, api_token'))
    }
    if (configuration.country_code) {
      configuration.country_code = configuration.country_code.toUpperCase()
      if (configuration.country_code !== 'CA' && !globals.hasOwnProperty(configuration.country_code + '_HOST')) {
        return Promise.reject(new TypeError('Invalid country code'))
      }
    }
    let data = {
      store_id: configuration.store_id,
      api_token: configuration.api_token
    }
    if (req.type === 'attribute_query' || req.type === 'session_query') {
      data.risk = {}
      data.risk[req.type] = req
    } else {
      data[req.type] = req
    }
    if (extended) {
      for (let key in extended) {
        if (extended.hasOwnProperty(key) && !data.hasOwnProperty(key)) {
          data[key] = extended[key]
        }
      }
    }
    let prefix = ''
    if (!!configuration.country_code && configuration.country_code !== 'CA') {
      prefix += configuration.country_code + '_'
    }
    let hostPrefix = prefix
    let filePrefix = prefix
    if (configuration.test) {
      hostPrefix += 'TEST_'
    }
    if (req.type === 'acs' || req.type === 'txn') {
      filePrefix += 'MPI_'
    }

    const options = {
      uri: globals.PROTOCOL + '://' + globals[hostPrefix + 'HOST'] + ':' + globals.PORT + globals[filePrefix + 'FILE'],
      method: 'POST',
      body: xmlBuilder.buildObject(data),
      headers: {
        'User-Agent': globals.API_VERSION
      },
      timeout: globals.CLIENT_TIMEOUT * 1000
    }

    return request(options)
          .then(res => xml.parseStringAsync(res))
          .then(res => Array.isArray(res.response.receipt) ? res.response.receipt[0] : res.response.receipt)
  };

  //Check out -> https://developer.moneris.com/More/Testing/Penny%20Value%20Simulator , for more "magic" amounts to force different responses.

  var firstElement = function(arr,assertion){
    return Array.isArray(arr) && arr.length>0 && arr[0] ? (assertion ? arr[0]===assertion: arr[0]) : null;
  }
  var normalizeExpiry = function(format,expiry){
    if(typeof format==='string' && format.toLowerCase().split('/').join('')==='mmyy'){
      return expiry.toString().split('').slice(2,4).join('')+expiry.toString().split('').slice(0,2).join('');
    }
    else {
      return expiry;
    }
  }
  var pay = function(args){
    var pan = cleanse(args.card,true);
    //Moneris takes expiry date format YY/MM, however most websites use the MM/YY format, you can specificy this in a verbose manner in the configuration by setting configuration.expiryFormat = 'MM/YY'; or the default 'YY/MM';
    var expdate = normalizeExpiry(configuration.expiryFormat,cleanse(args.expiry,true));
    var amount = args.amount;
    //--Moneris is super picky about formating..
    if(args.forceDecline && configuration.test){
      amount = 0.05;
    }
     amount = (amount ? numeral(amount).format('0.00'): false)
    //
    var suffix = (new Date()).getTime()+'-'+Math.ceil(Math.random()*10000);
    var order_id = args.order_id || cleanse(configuration.app_name,true)+'-Purchase-'+suffix;
    var cust_id = args.cust_id || 'customer-'+suffix;
    var dynamic_descriptor = args.description || args.dynamic_descriptor || 'purchase';
    var purchase = {
        type: 'purchase',
        cust_id,
        order_id,
        amount,
        pan,
        expdate,
        crypt_type: 7,
        dynamic_descriptor,
        status_check: false
    };
    return $q.fcall(function(){
      if(!amount || !pan || !expdate){
        throw {
          code: null,
          msg: 'INVALID_INPUTS'
        }
      }
      return send(purchase)
      .then(function(result){
          var fe = firstElement; //shorthand
          var code = fe(result.ResponseCode);
          var status = {
              msg: cleanse(fe(result.Message)),
              code,
              reference: fe(result.ReferenceNum),
              iso: fe(result.ISO),
              receipt: fe(result.ReceiptId),
              raw: result,
              isVisa: fe(result.CardType,"V"),
              isMasterCard: fe(result.CardType,"M"),
              isVisaDebit: fe(result.IsVisaDebit,"true"),
              authCode: fe(result.AuthCode),
              timeout: fe(result.TimedOut,"true"),
              date: fe(result.TransDate),
              time: fe(result.TransTime),
              custId: cust_id,
              orderId: order_id
          };
          var approved =  !status.timeout && ((code)=="00" || code ? parseInt(code)<50 : false );
          return $q.fcall(function(){
              if(approved){
                  return status;
              }
              else {
                  throw {
                      code: status.code,
                      msg: (status.timeout ? 'TIMEOUT': status.msg) || 'DECLINED',
                      raw: result
                  }
              }
          })
      })
    })
  };
  return { send, pay }
}
