# node-moneris

> A wrapper to access the Moneris API, forked from shaynair's great work (shaynair/moneris-js)

> The hope for this module is to create clean, robust, promise wrapped queries that extend just beyond payments, shaynair's work supports for generalized queries to Moneris however, the hope is to have more examples and handling of imperfect formatting. 

[Installation](#installation) |
[Usage](#usage) |
[Example](#example) |
[License](#license)

## Installation

With [npm](https://npmjs.org/):

```bash
npm install moneris-node --save
```

Note: You need **an engine that supports ES6 (e.g. Babel or Node 4.0+)**.

## General Usage

**`require('moneris-node')(credentials)`**

Queries the Moneris API with the information provided.

- `credentials`: **Required.** An object with the following fields.
  - `api_token`: **Required.** Your API token.
  - `store_id`: **Required.** Your store ID.
  - `test`: Optional. If true, uses Moneris Test endpoints. You can get a `api_token` and `store_id` for this endpoint from Moneris's Documentation. `false` by default.

## Example

We handle amount formatting for you, you just do your math.

We also clean the expiry to send it in the right format.

```bash
var moneris = require('moneris-node')({
  app_name: 'Alejandros Food Delivery',
  store_id: 'store5',
  api_token: 'yesguy',
  test: true
})
moneris.pay({
    amount: (5.99*2), 
    card: '4242424242424242',
    expiry: '20/11',
    description: 'Two drinks'
}).then((result)=>{ 
  console.log('--APROVED');
  console.log('Message: '+result.msg);
  console.log('Receipt: '+result.receipt);
  console.log('ISO: '+result.iso);
  console.log('Reference Number: '+result.reference);
  console.log('Raw Response:');
  console.log(result.raw);
})
.catch((err)=>{
  console.log('--DECLINED');
  console.log('Message: '+err.message);
  console.log('Code: '+err.code);
})
```

## General Usage

**`moneris.send(req[, extended])`**

- `req`: **Required.** An object with the following fields.
  - `type`: **Required.** The type of the request you wish to post.
  - ...All other fields that pertain to that type of request.
- `extended`: Optional. Certain types of requests require additional parameters, including but not limited to CVD, AVS, etc. This is an object that will add directly to the sent data (whereas `req` will create its own child element)


## License

[MIT](http://g14n.info/mit-license)
