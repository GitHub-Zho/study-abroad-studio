export function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url.replace(/\/$/, "");
  // Local dev fallback only — production must set NEXT_PUBLIC_APP_URL explicitly,
  // never infer the domain from the incoming request.
  return "http://localhost:3210";
}
