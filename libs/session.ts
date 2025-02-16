"use server";
import { SessionProps } from "@/app/login/action";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface DataProps {
  user: unknown;
  expires?: Date;
}

export async function encrypt(data: DataProps, secret: string) {
  const encryptSecret = Buffer.from(secret).toString("base64");
  const encryptAll = Buffer.from(
    JSON.stringify([data, encryptSecret])
  ).toString("base64");

  return encryptAll;
}
export async function decrypt(data: string): Promise<[SessionProps, string]> {
  const buffer = Buffer.from(data, "base64").toString();
  const result = JSON.parse(buffer);
  const secret = Buffer.from(result[1], "base64").toString();
  result[1] = secret;
  return result;
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;

  if (!session) return null;

  const parsed = await decrypt(session);

  return parsed[0];
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) return;

  const parsed = await decrypt(session);
  const data = parsed[0];
  const secret = parsed[1];

  data.expires = new Date(Date.now() + 30000 * 1000);

  (await cookies()).set("session", await encrypt(data, secret), {
    expires: data.expires,
    httpOnly: true,
  });

  NextResponse.next();
}

export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}
