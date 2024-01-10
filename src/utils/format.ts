import { AvsInfo, CofInfo, Response, ResponseData } from "../types";
import { cleanse } from "./cleanse";

type TextNode = {
  _text: string;
};

type AvsInfoNode = {
  [K in keyof AvsInfo]: TextNode;
};

type CofInfoNode = {
  [K in keyof CofInfo]: TextNode;
};

export const snakeToCamelCase = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());

export const camelToSnakeCase = (val: string): string =>
  val.replace(/([A-Z])/g, "_$1").toLowerCase();

export const pascalToCamelCase = (val: string): string =>
  val.charAt(0).toLowerCase() + val.slice(1);

export const format = (
  data: {
    [K in keyof ResponseData]: TextNode | AvsInfoNode | CofInfoNode;
  } & { iSO?: TextNode },
  sanitize = true
): Response<any> => {
  const response: ResponseData = {};

  if (data.iSO) {
    data.iso = data.iSO;
    delete data.iSO;
  }

  for (const [key, value] of Object.entries(data)) {
    response[key as keyof ResponseData] = (value as TextNode)._text;
  }

  if (data.resolveData) {
    response.resolveData = {};

    for (const [key, value] of Object.entries(data.resolveData)) {
      response.resolveData[key as keyof AvsInfo] = (value as TextNode)._text;
    }
  }

  if (data.cofInfo) {
    response.cofInfo = {};

    for (const [key, value] of Object.entries(data.cofInfo)) {
      response.cofInfo[key as keyof CofInfo] = (value as TextNode)._text;
    }
  }

  if (sanitize) {
    if (response.resolveData?.maskedPan) {
      response.resolveData.maskedPan = "****************";
    }
  }

  return {
    isSuccess:
      response.timedOut !== "true" &&
      (response.responseCode === "00" || response.responseCode
        ? parseInt(response.responseCode, 10) < 50
        : false),
    code: response.responseCode,
    message:
      (response.timedOut === "true"
        ? "TIMEOUT"
        : cleanse(response.message ?? "")) || "ERROR",
    data: response,
  };
};
