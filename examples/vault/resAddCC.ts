// Reference: https://github.com/Moneris/eCommerce-Unified-API-PHP/blob/master/Examples/CA/TestResAddCC.php

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
  const result = await moneryze.send("res_add_cc", {
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
    dataKey: '3bPYFo1CWoQs9XwtZtclcPPy2',
    receiptId: 'null',
    referenceNum: 'null',
    responseCode: '001',
    iSO: 'null',
    authCode: 'null',
    message: 'Successfully registered CC details.',
    transTime: '02:37:26',
    transDate: '2024-01-09',
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
    resolveData: {
      custId: 'customer1',
      phone: '5555551234',
      email: 'bob@smith.com',
      note: 'this is my note',
      avsStreetNumber: '123',
      avsStreetName: 'lakeshore blvd',
      avsZipcode: '90210',
      maskedPan: '****************',
      expdate: '2212',
      cryptType: '7'
    }
  }
}

*/
