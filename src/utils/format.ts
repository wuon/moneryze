import { Response, ResponseData } from "../types";
import { cleanse } from "./cleanse";

export const snakeToCamelCase = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());

export const camelToSnakeCase = (val: string): string =>
  val.replace(/([A-Z])/g, "_$1").toLowerCase();

export const pascalToCamelCase = (val: string): string =>
  val.charAt(0).toLowerCase() + val.slice(1);

export const removeJsonTextAttribute = (value: string, parentElement: any) => {
  try {
    const keyNo = Object.keys(parentElement._parent).length;
    const keyName = Object.keys(parentElement._parent)[keyNo - 1];
    parentElement._parent[keyName] = value;
  } catch (e) {
    console.log(e);
  }
};

export const format = (
  data: ResponseData & { iSO?: string },
  sanitize = true
): Response<any> => {
  const response = data;

  if (data.iSO) {
    response.iso = data.iSO;
    delete response.iSO;
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
