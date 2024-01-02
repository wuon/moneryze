import { cleanse } from "./cleanse";
import { format } from "./format";
import { TransactionType } from "../types";

export const filter = new Set<TransactionType>([
  "res_lookup_masked",
  "res_delete",
  "completion",
  "res_update_cc",
]);

export const sudo = new Set<TransactionType>(["res_lookup_masked"]);

// Moneris expects a top level 'request' tag
export const wrapInRequestField = (body: any) => {
  return {
    request: body,
  };
};

export { cleanse, format };
