import { createHmac } from "node:crypto";

const base64UrlEncode = (data: Buffer): string => {
	return data
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
};

const encodeJwtPart = (part: unknown): string =>
	base64UrlEncode(Buffer.from(JSON.stringify(part)));

export const sign = async (key: string): Promise<string> => {
	const [id, secret] = key.split(":");

	const now = Math.floor(Date.now() / 1000);
	const payload = { iat: now, exp: now + 300, aud: "/admin/" };
	const header = { alg: "HS256", typ: "JWT", kid: id };

	const encodedPayload = encodeJwtPart(payload);
	const encodedHeader = encodeJwtPart(header);

	const partialToken = `${encodedHeader}.${encodedPayload}`;

	const signature = createHmac("sha256", Buffer.from(secret, "hex"))
		.update(partialToken)
		.digest();

	const encodedSignature = base64UrlEncode(signature);

	return `${partialToken}.${encodedSignature}`;
};
