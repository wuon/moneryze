import { format } from "./format";

describe("format", () => {
  it("should format data correctly", () => {
    const data = {
      DataKey: { _text: "VS8olRRJyn2A3lsswaVHXVHf2" },
      ReceiptId: { _text: "null" },
      ReferenceNum: { _text: "null" },
      ResponseCode: { _text: "001" },
      ISO: { _text: "null" },
      AuthCode: { _text: "null" },
      Message: { _text: "Successfully registered CC details." },
      TransTime: { _text: "16:07:03" },
      TransDate: { _text: "2023-12-30" },
      TransType: { _text: "null" },
      Complete: { _text: "true" },
      TransAmount: { _text: "null" },
      CardType: { _text: "null" },
      TransID: { _text: "null" },
      TimedOut: { _text: "false" },
      CorporateCard: { _text: "null" },
      RecurSuccess: { _text: "null" },
      AvsResultCode: { _text: "null" },
      CvdResultCode: { _text: "null" },
      ResSuccess: { _text: "true" },
      PaymentType: { _text: "cc" },
      IsVisaDebit: { _text: "null" },
      ResolveData: {
        cust_id: {},
        phone: {},
        email: {},
        note: {},
        avs_street_number: {},
        avs_street_name: {},
        avs_zipcode: {},
        masked_pan: { _text: "4242***4242" },
        expdate: { _text: "2011" },
        crypt_type: { _text: "7" },
      },
    };

    const result = format(data);

    expect(result).toEqual({
      isSuccess: true,
      code: "001",
      message: "Successfully registered CC details.",
      data: {
        referenceNum: "null",
        dataKey: "VS8olRRJyn2A3lsswaVHXVHf2",
        iso: "null",
        receiptId: "null",
        avsResultCode: "null",
        cvdResultCode: "null",
        cardType: "null",
        isVisaDebit: "null",
        responseCode: "001",
        authCode: "null",
        transDate: "2023-12-30",
        transTime: "16:07:03",
        transAmount: "null",
        transId: "null",
        transType: "null",
        complete: "true",
        paymentType: "cc",
        resSuccess: "true",
        corporateCard: "null",
        recurSuccess: "null",
        resolveData: {
          custId: undefined,
          phone: undefined,
          email: undefined,
          note: undefined,
          avsStreetNumber: undefined,
          avsStreetName: undefined,
          avsZipcode: undefined,
          maskedPan: undefined,
          expdate: "2011",
          cryptType: "7",
        },
        kountInfo: undefined,
        kountResult: undefined,
        kountScore: undefined,
        kountTransactionId: undefined,
        message: "Successfully registered CC details.",
        timedOut: "false",
      },
    });
  });

  it("should sanitize data correctly", () => {
    const data = {
      ResolveData: {
        masked_pan: "1234567890123456",
      },
    };

    const result = format(data);

    expect(result.data.resolveData?.maskedPan).toBeUndefined();
  });

  it("should show message as TIMOUT when time out is true", () => {
    const data = {
      TimedOut: { _text: "true" },
    };

    const result = format(data);

    expect(result.message).toBe("TIMEOUT");
    expect(result.isSuccess).toBe(false);
  });

  it("should show message as ERROR when there is no TimedOut property", () => {
    const data = {};

    const result = format(data);

    expect(result.message).toBe("ERROR");
    expect(result.isSuccess).toBe(false);
  });
});
