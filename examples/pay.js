const moneris = require('../index');

moneris.init({
  app_name: 'Test',
  store_id: 'store5',
  api_token: 'yesguy',
  crypt_type: '7',
  test: true,
});

moneris.resAddCC({
  pan: '4242424242424242',
  expdate: '2011',
}).then((result) => {
  console.log('--');
  console.log('Clean Response (passed):');
  console.log(result);
})
  .catch((err) => { // DECLINED
    // err.raw = undefined;//comment out if you want the raw response.
    console.log('--');
    console.log('Clean Response (failed):');
    console.log(err);
    // console.log(err.raw);
  });

moneris.resPurchaseCC({
  amount: (5.99 * 2), // we handle formatting for you, you just do your math.
  token: 'umYoVyY4DqZPv2i1mp91JlLy2',
  description: 'Two drinks',
  // forceDecline: true, //uncomment this if you want to test declined card (test must be equal to true in credentials)
}).then((result) => { // APPROVED
  console.log('--');
  console.log('Clean Response (passed):');
  console.log(result);
})
  .catch((err) => { // DECLINED
  // err.raw = undefined;//comment out if you want the raw response.
    console.log('--');
    console.log('Clean Response (failed):');
    console.log(err);
  // console.log(err.raw);
  });

moneris.resPreauthCC({
  amount: (5.99 * 2), // we handle formatting for you, you just do your math.
  token: 'umYoVyY4DqZPv2i1mp91JlLy2',
  description: 'Two drinks',
  // forceDecline: true, //uncomment this if you want to test declined card (test must be equal to true in credentials)
}).then((result) => { // APPROVED
  console.log('--');
  console.log('Clean Response (passed):');
  console.log(result);
})
  .catch((err) => { // DECLINED
    // err.raw = undefined;//comment out if you want the raw response.
    console.log('--');
    console.log('Clean Response (failed):');
    console.log(err);
    // console.log(err.raw);
  });

moneris.resLookupMasked({
  token: 'umYoVyY4DqZPv2i1mp91JlLy2',
  // forceDecline: true, //uncomment this if you want to test declined card (test must be equal to true in credentials)
}).then((result) => { // APPROVED
  console.log('--');
  console.log('Clean Response (passed):');
  console.log(result);
})
  .catch((err) => { // DECLINED
    // err.raw = undefined;//comment out if you want the raw response.
    console.log('--');
    console.log('Clean Response (failed):');
    console.log(err);
    // console.log(err.raw);
  });
