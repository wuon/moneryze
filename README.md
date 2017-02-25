# node-moneris

> A wrapper to access the Moneris API, forked from shaynair's great work (shaynair/moneris-js)

[![NPM version](https://badge.fury.io/js/moneris.svg)](http://badge.fury.io/js/moneris) [![Build Status](https://travis-ci.org/shaynair/moneris-js.svg?branch=master)](https://travis-ci.org/shaynair/moneris-js?branch=master)
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

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

## Usage

**`moneris.send(req[, extended])`**

Queries the Moneris API with the information provided.

- `credentials`: **Required.** An object with the following fields.
  - `api_token`: **Required.** Your API token.
  - `store_id`: **Required.** Your store ID.
  - `test`: Optional. If true, uses Moneris Test endpoints. You can get a `api_token` and `store_id` for this endpoint from Moneris's Documentation. `false` by default.
- `req`: **Required.** An object with the following fields.
  - `type`: **Required.** The type of the request you wish to post.
  - ...All other fields that pertain to that type of request.
- `extended`: Optional. Certain types of requests require additional parameters, including but not limited to CVD, AVS, etc. This is an object that will add directly to the sent data (whereas `req` will create its own child element)

## Example

```bash
var moneris = require('moneris-node')({
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
```

## License

[MIT](http://g14n.info/mit-license)
