// Reference: https://github.com/Moneris/eCommerce-Unified-API-PHP/blob/master/Examples/CA/TestResAddToken.php

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
  const resTempAddResult = await moneryze.resTempAdd({
    pan: "5454545454545454",
    expdate: "1509",
    duration: "900",
    cryptType: "7",
  });

  const result = await moneryze.resAddToken({
    dataKey: resTempAddResult.data.dataKey ?? "ot-mtNKdu8NcxDoChqOJKZJZ1BOB",
    custId: "customer1",
    phone: "5555551234",
    email: "bob@smith.com",
    note: "this is my note",
    expdate: "1509",
    cryptType: "7",
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
    dataKey: 'zDSsAB4VQuNXZMDeNVqc1jjx4',
    receiptId: 'null',
    referenceNum: 'null',
    responseCode: '001',
    authCode: 'null',
    message: 'Successfully registered CC details.',
    transTime: '04:01:13',
    transDate: '2024-01-12',
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
      expdate: '1509',
      cryptType: '7'
    },
    iso: 'null'
  }
}

*/
