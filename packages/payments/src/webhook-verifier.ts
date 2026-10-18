import crypto from "crypto";

export function verifyPaystackSignature(
  rawBody: string | Buffer,
  signatureHeader: string | undefined,
  secretKey: string
): boolean {
  if (!signatureHeader || !secretKey) {
    return false;
  }

  const computedHash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  try {
    const signatureBuffer = Buffer.from(signatureHeader, "hex");
    const computedBuffer = Buffer.from(computedHash, "hex");

    if (signatureBuffer.length !== computedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, computedBuffer);
  } catch {
    return false;
  }
}
