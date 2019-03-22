'use strict'

const moneris = require('../index');

moneris.init({
  app_name: 'Test',
  store_id: 'store5',
  api_token: 'yesguy',
  test: true,
});

moneris.purchaseCC({
    amount: (5.99*2), // we handle formatting for you, you just do your math.
    card: '4242424242424242',
    expiry: '20/11',
    description: 'Two drinks',
    //forceDecline: true, //uncomment this if you want to test declined card (test must be equal to true in credentials)
}).then((result)=>{ //APPROVED
  result.raw = undefined;//comment out if you want the raw response.
  console.log('--');
  console.log('Clean Response (passed):');
  console.log(result)
})
.catch((err)=>{ //DECLINED
  //err.raw = undefined;//comment out if you want the raw response.
  console.log('--');
  console.log('Clean Response (failed):');
  console.log(err);
  //console.log(err.raw);
})
