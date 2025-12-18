import { auth } from "@/auth";

export function getUserSession() {
  return auth();
}
