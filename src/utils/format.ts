import { Response, ResponseData } from "../types";
import { cleanse } from "./cleanse";

const fe = (obj: any) => obj?._text;

export const format = (data: any, sanitize = true): Response => {
  const response: ResponseData = {};

  response.referenceNum = fe(data.ReferenceNum);
  response.dataKey = fe(data.DataKey);
  response.iso = fe(data.ISO);
  response.receiptId = fe(data.ReceiptId);
  response.avsResultCode = fe(data.AvsResultCode);
  response.cvdResultCode = fe(data.CvdResultCode);
  response.cardType = fe(data.CardType);
  response.isVisaDebit = fe(data.IsVisaDebit);
  response.responseCode = fe(data.ResponseCode);
  response.authCode = fe(data.AuthCode);
  response.transDate = fe(data.TransDate);
  response.transTime = fe(data.TransTime);
  response.transAmount = fe(data.TransAmount);
  response.transId = fe(data.TransID);
  response.transType = fe(data.TransType);
  response.complete = fe(data.Complete);
  response.paymentType = fe(data.PaymentType);
  response.resSuccess = fe(data.ResSuccess);
  response.corporateCard = fe(data.CorporateCard);
  response.recurSuccess = fe(data.RecurSuccess);
  response.resolveData = data.ResolveData
    ? {
        custId: fe(data.ResolveData.cust_id),
        phone: fe(data.ResolveData.phone),
        email: fe(data.ResolveData.email),
        note: fe(data.ResolveData.note),
        avsStreetNumber: fe(data.ResolveData.avs_street_number),
        avsStreetName: fe(data.ResolveData.avs_street_name),
        avsZipcode: fe(data.ResolveData.avs_zipcode),
        maskedPan: fe(data.ResolveData.masked_pan),
        expdate: fe(data.ResolveData.expdate),
        cryptType: fe(data.ResolveData.crypt_type),
      }
    : undefined;
  response.kountInfo = fe(data.KountInfo);
  response.kountResult = fe(data.KountResult);
  response.kountScore = fe(data.KountScore);
  response.kountTransactionId = fe(data.KountTransactionId);
  response.message = fe(data.Message);
  response.timedOut = fe(data.TimedOut);
  response.issuerId = fe(data.IssuerId);

  if (sanitize) {
    if (response.resolveData?.maskedPan) {
      response.resolveData.maskedPan = undefined;
    }
  }

  return {
    isSuccess:
      response.timedOut !== "true" &&
      (response.responseCode === "00" || response.responseCode
        ? parseInt(response.responseCode, 10) < 50
        : false),
    code: response.responseCode,
    message:
      (response.timedOut === "true"
        ? "TIMEOUT"
        : cleanse(response.message ?? "")) || "ERROR",
    data: response,
  };
};
