# moneryze

[![NPM version](https://img.shields.io/npm/v/moneryze.svg)](https://www.npmjs.com/package/moneryze)&nbsp;
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)&nbsp;
![Codecov](https://img.shields.io/codecov/c/github/wuon/moneryze)&nbsp;
![npm](https://img.shields.io/npm/dy/moneryze)

> A wrapper to access the Moneris API, forked from AlejandroEsquivel's great work ([AlejandroEsquivel/moneris-js](https://github.com/AlejandroEsquivel/moneris-js)), which was also based on shaynair's original implementation ([shaynair/moneris-js](https://github.com/shaynair/moneris-js)). The hope for this module is to create clean, robust, promise wrapped queries which modernize the original implementations from predecessors. Shaynair's work supported generalized queries to Moneris, and Alejandro's work handled the imperfect formatting. My hope is to extend and complete the wrapper, transforming the project into something easy to implement by any developer.

[Installation](#installation) |
[Usage](#usage) |
[License](#license)

## Installation

With [npm](https://npmjs.org/):

```bash
npm install moneryze
```

Note: The minimum node version to utilize this package is v18.x.x

## Usage

```typescript
import { Moneryze } from "moneryze";

const moneryze = new Moneryze({
  appName: "Test",
  storeId: "store5",
  apiToken: "yesguy",
  cryptType: "7",
  isTest: true,
  countryCode: "CA",
});

moneryze.send("res_add_cc", {
  pan: "4242424242424242",
  expdate: "2011",
});
```

To see the full list of what can be interfaced, it is highly recommended you examine the integration guide from Moneris [here](https://github.com/Moneris/eCommerce-Unified-API-PHP/blob/master/Unified-API-IG-PHP-v1.6.3.pdf).

To see some integration examples with this library, look [here](https://github.com/Wuon/moneryze/tree/main/examples).

### Configuration options

```typescript
export type MoneryzeConfig = {
  appName?: string;
  storeId: string;
  apiToken: string;
  cryptType?: string;
  isTest?: boolean;
  countryCode: Country;
};

const config: MoneryzeConfig = {
  // Describe options here!
};

const moneryze = new Moneryze(config);
```

- `appName`: Optional. If given, will add `appName` as a prefix to receipt names (eg: `Test-Purchase-1703974946117-1529`). Will default to `moneryze` if not specified.
- `apiToken`: **Required.** Your API token.
- `storeId`: **Required.** Your store ID.
- `cryptType`: Optional. If given, will set the default crypt_type for all transactions. `7` by default.
- `isTest`: Optional. If true, uses Moneris Test endpoints. You can get a `api_token` and `store_id` for this endpoint from Moneris's Documentation. `false` by default.
- `countryCode`: **Required**. Defines the region in which endpoint to interface with Moneris. Currently only suppports `CA` (Canada) or `US` (United States).

## License

[MIT](http://g14n.info/mit-license)

## Notes

Thanks for supporting this package! 🫡

wuon
