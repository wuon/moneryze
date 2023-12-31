import { wrapInRequestField } from ".";

describe("wrapInRequestField", () => {
  it("should wrap the input in a request field", () => {
    const body = { key: "value" };
    const result = wrapInRequestField(body);
    expect(result).toEqual({ request: { key: "value" } });
  });

  it("should handle null input", () => {
    const body = null;
    const result = wrapInRequestField(body);
    expect(result).toEqual({ request: null });
  });

  it("should handle undefined input", () => {
    const body = undefined;
    const result = wrapInRequestField(body);
    expect(result).toEqual({ request: undefined });
  });

  it("should handle empty object input", () => {
    const body = {};
    const result = wrapInRequestField(body);
    expect(result).toEqual({ request: {} });
  });
});
