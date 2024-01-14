// Reference: https://github.com/Moneris/eCommerce-Unified-API-PHP/blob/master/Examples/CA/TestResCardVerificationCC.php

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
  const resAddCCResponse = await moneryze.send("res_add_cc", {
    pan: "4242424242424242",
    expdate: "2212",
  });

  const result = await moneryze.send("res_card_verification_cc", {
    dataKey: resAddCCResponse.data.dataKey ?? "",
    orderId: "Test-Purchase-1641766640000-1",
    cryptType: "7",
    expdate: "2212",
    getNtResponse: "true",
    cvdInfo: {
      cvdIndicator: "1",
      cvdValue: "198",
    },
    avsInfo: {
      avsStreetNumber: "123",
      avsStreetName: "lakeshore blvd",
      avsZipcode: "90210",
    },
    cofInfo: {
      paymentIndicator: "U",
      paymentInformation: "2",
      issuerId: "168451306048014",
    },
  });
  console.log(result);
};

main();

/*
Example Response:

{
  isSuccess: true,
  code: '027',
  message: 'APPROVED',
  data: {
    dataKey: 'AjDoPrfV9TJ7MAUrBwUx6uku2',
    receiptId: 'Test-Purchase-1705125633302-9647',
    referenceNum: '660053720011650190',
    responseCode: '027',
    authCode: '000000',
    message: 'APPROVED           *                    =',
    transTime: '01:00:33',
    transDate: '2024-01-13',
    transType: '06',
    complete: 'true',
    transAmount: '0.00',
    cardType: 'V',
    transID: '70565-0_654',
    timedOut: 'false',
    corporateCard: 'false',
    recurSuccess: 'null',
    avsResultCode: 'null',
    cvdResultCode: '1M',
    resSuccess: 'true',
    paymentType: 'cc',
    isVisaDebit: 'null',
    resolveData: {
      custId: undefined,
      phone: undefined,
      email: undefined,
      note: undefined,
      expdate: '2212',
      maskedPan: '****************',
      cryptType: '7',
      avsStreetNumber: undefined,
      avsStreetName: undefined,
      avsZipcode: undefined
    },
    issuerId: '024011301003399',
    networkTokenization: undefined,
    iso: '01'
  }
}

*/
