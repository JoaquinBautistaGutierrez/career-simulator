import { utf8ToBytes } from "@noble/hashes/utils.js";

declare const canonicalJsonBrand: unique symbol;

export type CanonicalJson = string & {
  readonly [canonicalJsonBrand]: "CanonicalJson";
};

export type CanonicalJsonPrimitive = null | boolean | number | string;
export type CanonicalJsonValue =
  | CanonicalJsonPrimitive
  | readonly CanonicalJsonValue[]
  | { readonly [key: string]: CanonicalJsonValue };

export class CanonicalizationError extends Error {
  public constructor(
    message: string,
    public readonly path: string,
  ) {
    super(`${message} at ${path}`);
    this.name = "CanonicalizationError";
  }
}

const assertUnicodeScalarString = (value: string, path: string): void => {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);

    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (!Number.isFinite(nextCodeUnit) || nextCodeUnit < 0xdc00 || nextCodeUnit > 0xdfff) {
        throw new CanonicalizationError("String contains an unpaired high surrogate", path);
      }
      index += 1;
      continue;
    }

    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new CanonicalizationError("String contains an unpaired low surrogate", path);
    }
  }
};

const compareUtf16CodeUnits = (left: string, right: string): number => {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
};

const serializePrimitive = (value: CanonicalJsonPrimitive, path: string): CanonicalJson => {
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new CanonicalizationError("JSON numbers must be finite IEEE-754 doubles", path);
  }

  if (typeof value === "string") {
    assertUnicodeScalarString(value, path);
  }

  const serialized: string = JSON.stringify(value);
  return serialized as CanonicalJson;
};

const serializeArray = (
  value: readonly unknown[],
  path: string,
  activeObjects: WeakSet<object>,
): CanonicalJson => {
  const enumerableKeys = Object.keys(value);
  const expectedKeys = Array.from({ length: value.length }, (_, index) => String(index));
  const ownKeys = Reflect.ownKeys(value);

  if (
    enumerableKeys.length !== expectedKeys.length ||
    enumerableKeys.some((key, index) => key !== expectedKeys[index]) ||
    ownKeys.length !== value.length + 1 ||
    ownKeys.some((key) => typeof key === "symbol")
  ) {
    throw new CanonicalizationError(
      "Arrays must be dense and must not contain custom properties",
      path,
    );
  }

  const descriptors = Object.getOwnPropertyDescriptors(value);
  const elements = expectedKeys.map((key, index) => {
    const descriptor = descriptors[key];
    if (descriptor === undefined || !descriptor.enumerable || !("value" in descriptor)) {
      throw new CanonicalizationError(
        "JSON array elements must be enumerable data properties",
        `${path}[${String(index)}]`,
      );
    }
    return serializeCanonicalValue(value[index], `${path}[${String(index)}]`, activeObjects);
  });
  return `[${elements.join(",")}]` as CanonicalJson;
};

const serializeObject = (
  value: object,
  path: string,
  activeObjects: WeakSet<object>,
): CanonicalJson => {
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new CanonicalizationError("Only plain JSON objects are supported", path);
  }

  const keys = Reflect.ownKeys(value);
  if (keys.some((key) => typeof key === "symbol")) {
    throw new CanonicalizationError("JSON objects cannot contain symbol keys", path);
  }

  const stringKeys = keys as string[];
  const record = value as Readonly<Record<string, unknown>>;
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const key of stringKeys) {
    assertUnicodeScalarString(key, `${path}.{key}`);
    const descriptor = descriptors[key];
    if (descriptor === undefined || !descriptor.enumerable || !("value" in descriptor)) {
      throw new CanonicalizationError(
        "JSON object properties must be enumerable data properties",
        `${path}.${key}`,
      );
    }
  }

  const members = stringKeys.sort(compareUtf16CodeUnits).map((key) => {
    const serializedKey = serializePrimitive(key, `${path}.{key}`);
    const serializedValue = serializeCanonicalValue(record[key], `${path}.${key}`, activeObjects);
    return `${serializedKey}:${serializedValue}`;
  });

  return `{${members.join(",")}}` as CanonicalJson;
};

const serializeCanonicalValue = (
  value: unknown,
  path: string,
  activeObjects: WeakSet<object>,
): CanonicalJson => {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return serializePrimitive(value, path);
  }

  if (typeof value !== "object") {
    throw new CanonicalizationError(`Unsupported JSON value of type ${typeof value}`, path);
  }

  if (activeObjects.has(value)) {
    throw new CanonicalizationError("Cyclic structures cannot be canonicalized", path);
  }

  activeObjects.add(value);
  try {
    return Array.isArray(value)
      ? serializeArray(value, path, activeObjects)
      : serializeObject(value, path, activeObjects);
  } finally {
    activeObjects.delete(value);
  }
};

export const canonicalizeJson = (value: unknown): CanonicalJson =>
  serializeCanonicalValue(value, "$", new WeakSet<object>());

export const canonicalJsonToBytes = (value: CanonicalJson): Uint8Array => utf8ToBytes(value);
