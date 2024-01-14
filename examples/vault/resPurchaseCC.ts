// Reference: https://github.com/Moneris/eCommerce-Unified-API-PHP/blob/master/Examples/CA/TestResPurchaseCC-Recur.php

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
  const resAddCCResult = await moneryze.send("res_add_cc", {
    custId: "customer1",
    phone: "5555551234",
    email: "bob@smith.com",
    note: "this is my note",
    pan: "4242424242424242",
    expdate: "2212",
    cryptType: "7",
    dataKeyFormat: "0",
    avsInfo: {
      avsStreetNumber: "123",
      avsStreetName: "lakeshore blvd",
      avsZipcode: "90210",
    },
    cofInfo: {
      issuerId: "168451306048014",
    },
  });

  const result = await moneryze.send("res_purchase_cc", {
    dataKey: resAddCCResult.data.dataKey ?? "",
    orderId: "Test-Purchase-1641766640000-1",
    amount: "1.00",
    recur: {
      recurUnit: "day",
      startDate: "2030/01/09",
      numRecurs: "1",
      recurAmount: "1.00",
      period: "2",
      startNow: "true",
    },
    cvdInfo: {
      cvdIndicator: "1",
      cvdValue: "198",
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
  message: 'APPROVED : Recurring transaction successfully registered.',
  data: {
    dataKey: 'hNA76XGPn0gCOzArOa8IaGTt2',
    receiptId: 'Test-Purchase-1705264714071-1221',
    referenceNum: '660053720012440050',
    responseCode: '027',
    authCode: 'KN1275',
    message: 'APPROVED           *                    =: Recurring transaction successfully registered.',
    transTime: '15:38:34',
    transDate: '2024-01-14',
    transType: '00',
    complete: 'true',
    transAmount: '1.00',
    cardType: 'V',
    transID: '72439-0_654',
    timedOut: 'false',
    corporateCard: 'false',
    recurSuccess: 'true',
    avsResultCode: 'null',
    cvdResultCode: '1M',
    resSuccess: 'true',
    paymentType: 'cc',
    isVisaDebit: 'false',
    resolveData: {
      custId: 'customer1',
      phone: '5555551234',
      email: 'bob@smith.com',
      note: 'this is my note',
      expdate: '2212',
      maskedPan: '****************',
      cryptType: '7',
      avsStreetNumber: '123',
      avsStreetName: 'lakeshore blvd',
      avsZipcode: '90210'
    },
    iso: '01'
  }
}

*/
