const DEFAULT_SITE_URL = "https://www.spprosupply.com";

function normalizeSiteUrl(value: string | undefined): string {
  const trimmed = (value || "").trim().replace(/\/+$/, "");
  return trimmed || DEFAULT_SITE_URL;
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const SITE_NAME = "SP Pro Supply";
export const SITE_TITLE = `${SITE_NAME} | สื่อสุขศึกษาและอุปกรณ์สาธารณสุข`;
export const SITE_DESCRIPTION =
  "จำหน่ายสื่อสุขศึกษาและอุปกรณ์สาธารณสุข วงล้อ BMI วงล้อประเมินความเสี่ยงเบาหวานและความดัน แผ่นทดสอบสายตา และสื่อการเรียนรู้ด้านสุขภาพ";
export const SITE_LOGO_PATH = "/logo/logo.png";
export const FACEBOOK_URL = "https://www.facebook.com/sppro999";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateDescription(text: string, maxLength = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
