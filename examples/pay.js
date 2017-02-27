'use strict'

var moneris = require('../index')({
  app_name: 'Alejandros Food Delivery',
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
  result.raw = undefined;//comment out if you want the raw response.
  console.log('--');
  console.log('Clean Response:');
  console.log(result)
})
.catch((err)=>{ //DECLINED
  console.log('--DECLINED');
  console.log('Message: '+err.message);
  console.log('Code: '+err.code);
})
