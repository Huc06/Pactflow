import { describe, expect, it } from "vitest";
import bs58 from "bs58";
import { parseSecretKey } from "./attestation";

describe("Solana secret key parsing", () => {
  const bytes = Uint8Array.from({ length: 64 }, (_, index) => index);

  it("accepts a JSON byte array", () => {
    expect(parseSecretKey(JSON.stringify(Array.from(bytes)))).toEqual(bytes);
  });

  it("accepts a base58 key", () => {
    expect(parseSecretKey(bs58.encode(bytes))).toEqual(bytes);
  });

  it("rejects invalid JSON bytes", () => {
    expect(() => parseSecretKey("[256]")).toThrow("Invalid JSON secret key");
  });
});
