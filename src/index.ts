import convert from "xml-js";

import { cleanse, filter, format, sudo, wrapInRequestField } from "./utils";
import {
  API_VERSION,
  CLIENT_TIMEOUT,
  FILE,
  HOST,
  MPI_FILE,
  PORT,
  PROTOCOL,
  TEST_HOST,
  US_FILE,
  US_HOST,
} from "../constants/globals";
import {
  TransactionType,
  Country,
  ResAddCCRequest,
  ResAddCCResponse,
  Response,
} from "./types";
import {
  pascalToCamelCase,
  camelToSnakeCase,
  snakeToCamelCase,
} from "./utils/format";

export type MoneryzeConfig = {
  appName?: string;
  storeId: string;
  apiToken: string;
  cryptType?: string;
  isTest?: boolean;
  countryCode: Country;
  statusCheck?: boolean;
};

export const DEFAULT_MONERYZE_CONFIG = {
  appName: "moneryze",
  cryptType: "7",
  isTest: false,
  statusCheck: false,
};

export class Moneryze {
  private readonly _config: MoneryzeConfig;

  /**
   * Create a new Moneryze instance.
   * @param config - The configuration for this Moneryze instance.
   */
  constructor(config: MoneryzeConfig) {
    this._config = {
      ...DEFAULT_MONERYZE_CONFIG,
      ...config,
    };
  }

  /**
   * Interfaces with the Moneris host specified in the config.
   * @param type - The type of the transaction to send.
   * @param data - The data / body of the transaction / request.
   * @returns The result of the transaction / request.
   *
   * @example
   * ```ts
   * // Sends a request using the 'res_add_cc' transaction type.
   * moneryze.send("res_add_cc", {
   *   pan: "4242424242424242",
   *   expdate: "2011",
   * });
   * ```
   */
  async send(type: TransactionType, data: any): Promise<Response<any>> {
    const suffix = `${new Date().getTime()}-${Math.ceil(
      Math.random() * 10000
    )}`;
    const out = data;
    if (!filter.has(type)) {
      out.crypt_type = data.crypt_type || this._config.cryptType;
      out.order_id =
        out.order_id ||
        `${cleanse(
          this._config.appName || DEFAULT_MONERYZE_CONFIG.appName,
          true
        )}-Purchase-${suffix}`;
    }
    if (this._config.isTest && out.test) {
      out.amount = 0.05;
      delete out.test;
    }
    if (out.pan) {
      out.pan = cleanse(data.pan, true);
    }
    if (out.expdate) {
      out.expdate = cleanse(data.expdate, true);
    }
    if (out.description) {
      out.dynamic_descriptor =
        out.description || out.dynamic_descriptor || type;
      delete out.description;
    }
    if (out.token) {
      out.data_key = out.token;
      delete out.token;
    }
    if (out.cvd_info) {
      out.cvd_info = cleanse(out.cvd_info);
    }
    if (out.avs_info) {
      out.avs_info = cleanse(out.avs_info);
    }

    if (type === "kount_inquiry") {
      // default values for email and ANID when they weren't specified in payload
      if (!out.email) {
        out.email = "noemail@kount.com";
      }
      if (!out.auto_number_id) {
        out.auto_number_id = "0123456789";
      }
    }

    const body: any = {
      storeId: this._config.storeId,
      apiToken: this._config.apiToken,
      statusCheck: this._config.statusCheck ?? false,
    };

    if (type === "attribute_query" || type === "session_query") {
      body.risk = {};
      body.risk[type] = out;
    } else {
      body[type] = out;
    }

    let host;
    let path;

    switch (this._config.countryCode) {
      case "US":
        host = US_HOST;
        path = US_FILE;
        break;
      case "CA":
      default:
        host = HOST;
        path = FILE;
        break;
    }

    if (this._config.isTest) {
      host = TEST_HOST;
    }

    if (type === "acs" || type === "txn") {
      path = MPI_FILE;
    }

    const response = await fetch(`${PROTOCOL}://${host}:${PORT}${path}`, {
      method: "POST",
      body: convert.js2xml(wrapInRequestField(body), {
        compact: true,
        spaces: 4,
        elementNameFn: (val) => camelToSnakeCase(val),
      }),
      headers: {
        "User-Agent": API_VERSION,
        "Content-Type": "text/xml",
      },
      signal: AbortSignal.timeout(CLIENT_TIMEOUT * 1000),
    });

    const xmlResponse = await response.text();

    const jsonResponse = convert.xml2js(xmlResponse, {
      compact: true,
      elementNameFn: (val) =>
        val.includes("_") ? snakeToCamelCase(val) : pascalToCamelCase(val),
    }) as any;

    const receipt = Array.isArray(jsonResponse.response.receipt)
      ? jsonResponse.response.receipt[0]
      : jsonResponse.response.receipt;

    return format(receipt, !sudo.has(type));
  }

  async resAddCC(data: ResAddCCRequest): Promise<Response<ResAddCCResponse>> {
    return this.send("res_add_cc", data);
  }
}
