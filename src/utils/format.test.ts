import {
  camelToSnakeCase,
  format,
  pascalToCamelCase,
  removeJsonTextAttribute,
  snakeToCamelCase,
} from "./format";

describe("format", () => {
  describe("snakeToCamelCase", () => {
    it("should convert snake_case to camelCase", () => {
      const input = "some_snake_case_string";
      const expectedOutput = "someSnakeCaseString";
      expect(snakeToCamelCase(input)).toEqual(expectedOutput);
    });

    it("should convert kebab-case to camelCase", () => {
      const input = "some-kebab-case-string";
      const expectedOutput = "someKebabCaseString";
      expect(snakeToCamelCase(input)).toEqual(expectedOutput);
    });

    it("should handle empty strings", () => {
      const input = "";
      const expectedOutput = "";
      expect(snakeToCamelCase(input)).toEqual(expectedOutput);
    });

    it("should handle strings with no hyphens or underscores", () => {
      const input = "somestring";
      const expectedOutput = "somestring";
      expect(snakeToCamelCase(input)).toEqual(expectedOutput);
    });
  });

  describe("camelToSnakeCase", () => {
    it("should convert camelCase to snake_case", () => {
      const input = "someCamelCaseString";
      const expectedOutput = "some_camel_case_string";
      expect(camelToSnakeCase(input)).toEqual(expectedOutput);
    });

    it("should handle empty strings", () => {
      const input = "";
      const expectedOutput = "";
      expect(camelToSnakeCase(input)).toEqual(expectedOutput);
    });

    it("should handle strings with no uppercase letters", () => {
      const input = "somestring";
      const expectedOutput = "somestring";
      expect(camelToSnakeCase(input)).toEqual(expectedOutput);
    });
  });

  describe("pascalToCamelCase", () => {
    it("should convert PascalCase to camelCase", () => {
      const input = "SomePascalCaseString";
      const expectedOutput = "somePascalCaseString";
      expect(pascalToCamelCase(input)).toEqual(expectedOutput);
    });

    it("should handle empty strings", () => {
      const input = "";
      const expectedOutput = "";
      expect(pascalToCamelCase(input)).toEqual(expectedOutput);
    });

    it("should handle strings with no uppercase letters", () => {
      const input = "somestring";
      const expectedOutput = "somestring";
      expect(pascalToCamelCase(input)).toEqual(expectedOutput);
    });

    it("should handle strings with uppercase letters but no lowercase letters", () => {
      const input = "SOMESTRING";
      const expectedOutput = "sOMESTRING";
      expect(pascalToCamelCase(input)).toEqual(expectedOutput);
    });
  });

  describe("removeJsonTextAttribute", () => {
    it("should remove _text attribute from parent element", () => {
      const parentElement = {
        _parent: {
          key1: { _text: "value1" },
          key2: { _text: "value2" },
        },
      };
      const value = "newValue";
      removeJsonTextAttribute(value, parentElement);
      expect(parentElement._parent.key2).toEqual(value);
    });

    it("should handle parent element with no _text attribute", () => {
      const parentElement = {
        _parent: {
          key1: "value1",
          key2: "value2",
        },
      };
      const value = "newValue";
      removeJsonTextAttribute(value, parentElement);
      expect(parentElement._parent.key2).toEqual(value);
    });
  });

  describe("format", () => {
    it("should format data correctly", () => {
      const input = {
        resolveData: { maskedPan: "1234" },
        cofInfo: { issuerId: "value4" },
        iSO: "value5",
        message: "test",
        responseCode: "00",
      };
      const expectedOutput = {
        isSuccess: true,
        code: "00",
        message: "test",
        data: {
          iso: "value5",
          resolveData: { maskedPan: "****************" },
          cofInfo: { issuerId: "value4" },
          message: "test",
          responseCode: "00",
        },
      };
      expect(format(input)).toEqual(expectedOutput);
    });

    it("should handle empty data", () => {
      const input = {};
      const expectedOutput = {
        isSuccess: false,
        code: undefined,
        message: "ERROR",
        data: {},
      };
      expect(format(input)).toEqual(expectedOutput);
    });

    it("should sanitize maskedPan in resolveData", () => {
      const input = {
        resolveData: { maskedPan: "1234" },
      };
      const expectedOutput = {
        isSuccess: false,
        code: undefined,
        message: "ERROR",
        data: {
          resolveData: { maskedPan: "****************" },
        },
      };
      expect(format(input)).toEqual(expectedOutput);
    });

    it("should handle data with iSO field", () => {
      const input = {
        iSO: "value5",
      };
      const expectedOutput = {
        isSuccess: false,
        code: undefined,
        message: "ERROR",
        data: {
          iso: "value5",
        },
      };
      expect(format(input)).toEqual(expectedOutput);
    });

    it("should handle data with resolveData field", () => {
      const input = {
        resolveData: { custId: "value1" },
      };
      const expectedOutput = {
        isSuccess: false,
        code: undefined,
        message: "ERROR",
        data: {
          resolveData: { custId: "value1" },
        },
      };
      expect(format(input)).toEqual(expectedOutput);
    });

    it("should handle data with cofInfo field", () => {
      const input = {
        cofInfo: { issuerId: "value2" },
      };
      const expectedOutput = {
        isSuccess: false,
        code: undefined,
        message: "ERROR",
        data: {
          cofInfo: { issuerId: "value2" },
        },
      };
      expect(format(input)).toEqual(expectedOutput);
    });
  });
});
