export type Country = "CA" | "US";

export type TransactionType =
  // Basic
  | "batchclose"
  | "card_verification"
  | "cavv_preauth"
  | "cavv_purchase"
  | "completion"
  | "contactless_purchase"
  | "contactless_purchasecorrection"
  | "contactless_refund"
  | "forcepost"
  | "ind_refund"
  | "opentotals"
  | "preauth"
  | "purchase"
  | "purchasecorrection"
  | "reauth"
  | "recur_update"
  | "refund"

  // Encrypted
  | "enc_card_verification"
  | "enc_forcepost"
  | "enc_ind_refund"
  | "enc_preauth"
  | "enc_purchase"
  | "enc_res_add_cc"
  | "enc_res_update_cc"
  | "enc_track2_forcepost"
  | "enc_track2_ind_refund"
  | "enc_track2_preauth"
  | "enc_track2_purchase"

  // Interac Online
  | "idebit_purchase"
  | "idebit_refund"

  // Vault
  | "res_add_cc"
  | "res_add_token"
  | "res_card_verification_cc"
  | "res_cavv_preauth_cc"
  | "res_cavv_purchase_cc"
  | "res_delete"
  | "res_get_expiring"
  | "res_ind_refund_cc"
  | "res_iscorporatecard"
  | "res_lookup_full"
  | "res_lookup_masked"
  | "res_mpitxn"
  | "res_preauth_cc"
  | "res_purchase_cc"
  | "res_temp_add"
  | "res_temp_tokenize"
  | "res_tokenize_cc"
  | "res_update_cc"
  | "res_forcepost_cc"

  // Track2
  | "track2_completion"
  | "track2_forcepost"
  | "track2_ind_refund"
  | "track2_preauth"
  | "track2_purchase"
  | "track2_purchasecorrection"
  | "track2_refund"

  // VDotMe
  | "vdotme_completion"
  | "vdotme_getpaymentinfo"
  | "vdotme_preauth"
  | "vdotme_purchase"
  | "vdotme_purchasecorrection"
  | "vdotme_reauth"
  | "vdotme_refund"

  // MasterPass
  | "paypass_send_shopping_cart"
  | "paypass_retrieve_checkout_data"
  | "paypass_purchase"
  | "paypass_cavv_purchase"
  | "paypass_preauth"
  | "paypass_cavv_preauth"
  | "paypass_txn"

  // US ACH
  | "us_ach_credit"
  | "us_ach_debit"
  | "us_ach_fi_enquiry"
  | "us_ach_reversal"

  // US Basic
  | "us_batchclose"
  | "us_card_verification"
  | "us_cavv_preauth"
  | "us_cavv_purchase"
  | "us_completion"
  | "us_contactless_purchase"
  | "us_contactless_purchasecorrection"
  | "us_contactless_refund"
  | "us_forcepost"
  | "us_ind_refund"
  | "us_opentotals"
  | "us_pinless_debit_purchase"
  | "us_pinless_debit_refund"
  | "us_preauth"
  | "us_purchase"
  | "us_purchasecorrection"
  | "us_reauth"
  | "us_recur_update"
  | "us_refund"

  // US Encrypted
  | "us_enc_card_verification"
  | "us_enc_forcepost"
  | "us_enc_ind_refund"
  | "us_enc_preauth"
  | "us_enc_purchase"
  | "us_enc_res_add_cc"
  | "us_enc_res_update_cc"
  | "us_enc_track2_forcepost"
  | "us_enc_track2_ind_refund"
  | "us_enc_track2_preauth"
  | "us_enc_track2_purchase"

  // US Vault
  | "us_res_add_cc"
  | "us_res_add_ach"
  | "us_res_add_pinless"
  | "us_res_add_token"
  | "us_res_delete"
  | "us_res_get_expiring"
  | "us_res_ind_refund_ach"
  | "us_res_ind_refund_cc"
  | "us_res_iscorporatecard"
  | "us_res_lookup_full"
  | "us_res_lookup_masked"
  | "us_res_preauth_cc"
  | "us_res_purchase_ach"
  | "us_res_purchase_cc"
  | "us_res_purchase_pinless"
  | "us_res_temp_add"
  | "us_res_tokenize_cc"
  | "us_res_update_cc"
  | "us_res_update_ach"
  | "us_res_update_pinless"

  // US Track2
  | "us_track2_completion"
  | "us_track2_forcepost"
  | "us_track2_ind_refund"
  | "us_track2_preauth"
  | "us_track2_purchase"
  | "us_track2_purchasecorrection"
  | "us_track2_refund"

  // MPI - Common CA and US
  | "txn"
  | "acs"

  // Group Transaction - Common CA and US
  | "group"

  // Risk - CA only
  | "session_query"
  | "attribute_query"

  // Level 23
  | "iscorporatecard"

  // Amex General level23
  | "axcompletion"
  | "axrefund"
  | "axind_refund"
  | "axpurchasecorrection"
  | "axforcepost"

  // Amex Air & Rail level23
  | "axracompletion"
  | "axrarefund"
  | "axraind_refund"
  | "axrapurchasecorrection"
  | "axraforcepost"

  // Visa General, Air & Rail Level23
  | "vscompletion"
  | "vsrefund"
  | "vsind_refund"
  | "vsforcepost"
  | "vspurchasecorrection"
  | "vscorpais"

  // MasterCard General, Air and Rail Level23
  | "mccompletion"
  | "mcrefund"
  | "mcind_refund"
  | "mcpurchasecorrection"
  | "mcforcepost"
  | "mccorpais"

  // MCP transactions
  | "mcp_completion"
  | "mcp_ind_refund"
  | "mcp_preauth"
  | "mcp_purchase"
  | "mcp_purchasecorrection"
  | "mcp_refund"
  | "mcp_res_ind_refund_cc"
  | "mcp_res_preauth_cc"
  | "mcp_res_purchase_cc"
  | "mcp_get_rate"
  | "mcp_cavv_preauth"
  | "mcp_cavv_purchase"
  | "mcp_res_cavv_preauth_cc"
  | "mcp_res_cavv_purchase_cc"

  // Apple Pay
  | "applepay_token_purchase"
  | "applepay_token_preauth"
  | "applepay_mcp_purchase"
  | "applepay_mcp_preauth"

  // Google Pay
  | "googlepay_purchase"
  | "googlepay_preauth"
  | "googlepay_mcp_purchase"
  | "googlepay_mcp_preauth"

  // OCTPayment transactions
  | "oct_payment"
  | "res_oct_payment_cc"

  // Installment Plans
  | "installment_info"
  | "installment_lookup"
  | "res_installment_lookup"

  // Future proofing for new transaction types
  | string;

export type Recur = {
  recurUnit?: string;
  startNow?: string;
  startDate?: string;
  numRecurs?: string;
  period?: string;
  recurAmount?: string;
};

export type CvdInfo = {
  cvdIndicator?: string;
  cvdValue?: string;
};

export type ConvFeeInfo = {
  convenienceFee?: string;
};

export type CofInfo = {
  paymentIndicator?: string;
  paymentInformation?: string;
  issuerId?: string;
};

export type AchInfo = {
  sec?: string;
  custFirstName?: string;
  custLastName?: string;
  custAddress1?: string;
  custAddress2?: string;
  custCity?: string;
  custState?: string;
  custZip?: string;
  routingNum?: string;
  accountNum?: string;
  checkNum?: string;
  accountType?: string;
  micr?: string;
};

export type AvsInfo = {
  avsStreetName?: string;
  avsStreetNumber?: string;
  avsZipcode?: string;
  cryptType?: string;
  custId?: string;
  email?: string;
  expdate?: string;
  maskedPan?: string;
  note?: string;
  phone?: string;
  anc1?: string;
};

export type RequestData = {
  dataKey?: string;
  orderId?: string;
  amount?: string;
  recur?: Recur;
  cvdInfo?: CvdInfo;
  custId?: string;
  phone?: string;
  email?: string;
  note?: string;
  pan?: string;
  expdate?: string;
  cryptType?: string;
  dataKeyFormat?: string;
  avsInfo?: AvsInfo;
  cofInfo?: CofInfo;
  duration?: string;
  getNtResponse?: string;
};

export type ResponseData = {
  achInfo?: AchInfo;
  authCode?: string;
  avsResultCode?: string;
  cardType?: string;
  cofInfo?: CofInfo;
  complete?: string;
  corporateCard?: string;
  convFeeInfo?: ConvFeeInfo;
  cvdInfo?: CvdInfo;
  cvdResultCode?: string;
  dataKey?: string;
  isVisaDebit?: string;
  issuerId?: string;
  kountInfo?: string;
  kountResult?: string;
  kountScore?: string;
  kountTransactionId?: string;
  networkTokenization?: string;
  message?: string;
  paymentType?: string;
  receiptId?: string;
  referenceNum?: string;
  recur?: Recur;
  recurSuccess?: string;
  resSuccess?: string;
  resolveData?: AvsInfo;
  responseCode?: string;
  iso?: string;
  timedOut?: string;
  transAmount?: string;
  transDate?: string;
  transId?: string;
  transTime?: string;
  transType?: string;
};

export type Response<T> = {
  isSuccess: boolean;
  code?: string;
  message: string;
  data: T;
};
