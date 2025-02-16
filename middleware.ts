import { NextRequest } from "next/server";
import { updateSession } from "./libs/session";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
