export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function normalizeRoutePath(path: string): string {
  const withoutQuery = path.split('?')[0].split('#')[0].trim();
  if (!withoutQuery || withoutQuery === '/') {
    return '/';
  }
  return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

export function isPublicRoute(path: string, search: string = ''): boolean {
  const normalizedPath = normalizeRoutePath(path);
  if (PUBLIC_ROUTES.some((route) => normalizedPath.startsWith(route))) {
    return true;
  }
  if (extractResetTokenFromUrl(normalizedPath, search)) {
    return true;
  }
  return new URLSearchParams(search).has('token');
}

export function extractResetTokenFromUrl(path: string, search: string): string | null {
  const pathMatch = path.match(/\/reset-password\/([^/?#]+)/);
  if (pathMatch?.[1]) {
    return pathMatch[1].trim();
  }
  const queryToken = new URLSearchParams(search).get('token');
  return queryToken?.trim() || null;
}
