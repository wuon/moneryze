import { Moneryze, MoneryzeConfig, DEFAULT_MONERYZE_CONFIG } from ".";
import { TransactionType } from "./types";

describe("Moneryze", () => {
  let config: MoneryzeConfig;
  let instance: Moneryze;

  beforeEach(() => {
    config = {
      ...DEFAULT_MONERYZE_CONFIG,
      appName: "TestApp",
      cryptType: "testCrypt",
      isTest: true,
      storeId: "testStore",
      apiToken: "testToken",
      countryCode: "US",
    };
    instance = new Moneryze(config);
  });

  it("should create an instance of Moneryze with the provided configuration", () => {
    expect(instance).toBeInstanceOf(Moneryze);
  });

  it("should send a transaction", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      text: jest
        .fn()
        .mockResolvedValue("<response><receipt></receipt></response>"),
    });
    global.fetch = mockFetch;

    const type: TransactionType = "purchase";
    const data = {
      order_id: "testOrder",
      pan: "testPan",
      expdate: "testExpdate",
      description: "testDescription",
      token: "testToken",
      cvd_info: "testCvdInfo",
      avs_info: "testAvsInfo",
    };

    const response = await instance.send(type, data);

    expect(mockFetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  describe("resAddCC", () => {
    it("should send a res_add_cc transaction with default values", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        text: jest
          .fn()
          .mockResolvedValue("<response><receipt></receipt></response>"),
      });
      global.fetch = mockFetch;

      const data = {
        pan: "testPan",
        expdate: "testExpdate",
      };

      const response = await instance.resAddCC(data);

      expect(mockFetch).toHaveBeenCalled();
      expect(response).toBeDefined();
    });

    it("should send a res_add_cc transaction with provided values", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        text: jest
          .fn()
          .mockResolvedValue("<response><receipt></receipt></response>"),
      });
      global.fetch = mockFetch;

      const data = {
        pan: "testPan",
        expdate: "testExpdate",
        crypt_type: "testCryptType",
        avs_street_number: "testAvsStreetNumber",
        avs_street_name: "testAvsStreetName",
        avs_zipcode: "testAvsZipcode",
      };

      const response = await instance.resAddCC(data);

      expect(mockFetch).toHaveBeenCalled();
      expect(response).toBeDefined();
    });
  });

  describe("resTempAdd", () => {
    it("should send a res_temp_add transaction", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        text: jest
          .fn()
          .mockResolvedValue("<response><receipt></receipt></response>"),
      });
      global.fetch = mockFetch;

      const data = {
        pan: "testPan",
        expdate: "testExpdate",
        duration: "testDuration",
      };

      const response = await instance.resTempAdd(data);

      expect(mockFetch).toHaveBeenCalled();
      expect(response).toBeDefined();
    });
  });
});
