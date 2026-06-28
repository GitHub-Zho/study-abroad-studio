import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
