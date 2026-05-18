export const PUBLIC_ROUTES = ['/login', '/register'];

export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
}
