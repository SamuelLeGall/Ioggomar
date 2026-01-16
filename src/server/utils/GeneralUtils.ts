export const randomIntNumberInclusive = (minimum: number, maximum: number) => {
  const range = maximum - minimum + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return minimum + (array[0] % range);
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

export function generateUUID() {
  return crypto.randomUUID();
}
