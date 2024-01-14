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
});
