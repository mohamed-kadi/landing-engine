export function getSiteOrigin(canonicalUrl: string) {
  return new URL(canonicalUrl).origin;
}

export function absoluteUrl(pathOrUrl: string, baseUrl: string) {
  return new URL(pathOrUrl, baseUrl).toString();
}
