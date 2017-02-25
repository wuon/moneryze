'use strict'

var moneris = require('../index')({
  app_name: 'Alejandros Alcohol Delivery',
  store_id: 'store5',
  api_token: 'yesguy',
  test: true
})

moneris.pay({
    amount: (5.99*2), // we handle formatting for you, you just do your math.
    card: '4242424242424242',
    expiry: '20/11',
    description: 'Two drinks'
}).then((result)=>{ //APPROVED
  console.log('--APROVED');
  console.log('Message: '+result.msg);
  console.log('Receipt: '+result.receipt);
  console.log('ISO: '+result.iso);
  console.log('Reference Number: '+result.reference);
  console.log('Raw Response:');
  console.log(result.raw);
})
.catch((err)=>{ //DECLINED
  console.log('--DECLINED');
  console.log('Message: '+err.message);
  console.log('Code: '+err.code);
})
