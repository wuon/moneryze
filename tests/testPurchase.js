'use strict'

var moneris = require('../index')({
  app_name: 'Alejandros Alcohol Delivery',
  store_id: 'store5',
  api_token: 'yesguy',
  test: true
})

moneris.pay({
    amount: '1.00',
    card: '4242424242424242',
    expiry: '20/11',
    description: 'Booking'
}).then((result)=>{ //APPROVED
  console.log('--APROVED');
  console.log('Message: '+result.msg);
  console.log('Receipt: '+result.receipt);
  console.log('ISO: '+result.iso);
  console.log('Reference Number: '+result./// <reference path="" />);
})
.catch((err)=>{ //DECLINED
  console.log('--DECLINED');
  console.log('Message: '+err.message);
  console.log('Code: '+err.code);
})
