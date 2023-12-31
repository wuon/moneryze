import { cleanse } from "./cleanse";

describe("cleanse", () => {
  it("should remove special characters from string", () => {
    const str = "/=!*-Hello World";
    const result = cleanse(str);
    expect(result).toEqual("Hello World");
  });

  it("should remove spaces when second parameter is true", () => {
    const str = "Hello World";
    const result = cleanse(str, true);
    expect(result).toEqual("HelloWorld");
  });

  it("should return empty string when input is empty", () => {
    const str = "";
    const result = cleanse(str);
    expect(result).toEqual("");
  });

  it("should replace multiple spaces with a single space", () => {
    const str = "Hello     World";
    const result = cleanse(str);
    expect(result).toEqual("Hello World");
  });
});
