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
module.exports = function(credentials){
  function send (req, extended) {
    if(extended === undefined) {
      extended = null;
    }
    if (!credentials || !req || !req.type || !credentials.store_id || !credentials.api_token) {
      return Promise.reject(new TypeError('Requires country_code, store_id, api_token'))
    }
    if (credentials.country_code) {
      credentials.country_code = credentials.country_code.toUpperCase()
      if (credentials.country_code !== 'CA' && !globals.hasOwnProperty(credentials.country_code + '_HOST')) {
        return Promise.reject(new TypeError('Invalid country code'))
      }
    }
    let data = {
      store_id: credentials.store_id,
      api_token: credentials.api_token
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
    if (!!credentials.country_code && credentials.country_code !== 'CA') {
      prefix += credentials.country_code + '_'
    }
    let hostPrefix = prefix
    let filePrefix = prefix
    if (credentials.test) {
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
  var pay = function(args){
    var pan = cleanse(args.card);
    var expdate = cleanse(args.expiry,true);
    var amount = args.amount;
    //--Moneris is super picky about formating..
    if(args.forceDecline && credentials.test){
      amount = 0.05;
    }
     amount = (amount ? numeral(amount).format('0,0.00'): false)
    //
    var suffix = (new Date()).getTime()+'-'+Math.ceil(Math.random()*10000);
    var order_id = args.order_id || cleanse(credentials.app_name,true)+'-Purchase-'+suffix;
    var cust_id = args.cust_id || 'customer-'+suffix;
    var dynamic_descriptor = args.description || args.dynamic_descriptor || 'purchase';
    if(credentials.test){
      console.log('--Defaulting to order_id: '+order_id);
      console.log('--Defaulting to cust_id: '+cust_id);
    }
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
          console.log(result);
          var code = result.ResponseCode[0];
          var status = {
              msg: cleanse(result.Message[0]),
              code,
              reference: result.ReferenceNum[0],
              iso: result.ISO[0],
              receipt: result.ReceiptId[0],
              raw: result,
              isVisa: result.CardType[0]=="V",
              isMasterCard: result.CardType[0]=="M",
              isVisaDebit: result.IsVisaDebit[0] == "true",
              isCorporateCard: result.CorporateCard[0] == "true",
              authCode: result.AuthCode[0],
              timeout: result.TimedOut[0]=="true",
              date: result.TransDate[0],
              time: result.TransTime[0],
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
