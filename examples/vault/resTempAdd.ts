// Reference: https://github.com/Moneris/eCommerce-Unified-API-PHP/blob/master/Examples/CA/TestResTempAdd.php

import { Moneryze } from "../../src";

const moneryze = new Moneryze({
  appName: "Test",
  storeId: "store5",
  apiToken: "yesguy",
  cryptType: "7",
  isTest: true,
  countryCode: "CA",
});

const main = async () => {
  const result = await moneryze.send("res_temp_add", {
    pan: "5454545454545454",
    expdate: "1509",
    duration: "900",
    dataKeyFormat: "0",
    cryptType: "7",
  });
  console.log(result);
};

main();

/*
Example Response:

{
  isSuccess: true,
  code: '001',
  message: 'Successfully registered CC details.',
  data: {
    dataKey: 'ot-aUfCSFwRF3K9pQrddJonFJ514',
    receiptId: 'null',
    referenceNum: 'null',
    responseCode: '001',
    authCode: 'null',
    message: 'Successfully registered CC details.',
    transTime: '02:39:01',
    transDate: '2024/01/10',
    transType: 'null',
    complete: 'true',
    transAmount: 'null',
    cardType: 'null',
    transID: 'null',
    timedOut: 'false',
    corporateCard: 'null',
    recurSuccess: 'null',
    avsResultCode: 'null',
    cvdResultCode: 'null',
    resSuccess: 'true',
    paymentType: 'cc',
    isVisaDebit: 'null',
    resolveData: { anc1: undefined, maskedPan: '****************', expdate: '1509' },
    iso: 'null'
  }
}

*/
