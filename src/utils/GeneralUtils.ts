import crypto from "crypto";

export const randomIntNumberInclusive = (minimum: number, maximum: number) => {
  return crypto.randomInt(minimum, maximum + 1);
};

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || typeof value === "string") {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}
