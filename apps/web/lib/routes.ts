/**
 * Rotas que não requerem autenticação
 */
export const publicRoutes: string[] = ["/auth/verify"];

/**
 * Rotas que são usadas para autenticação
 */
export const authRoutes: string[] = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/reset-password",
  "/auth/forgot-password",
];

/**
 * Rotas que requerem autenticação
 */
export const privateRoutes: string[] = [
  "/dashboard",
  "/user-profile",
  "/settings",
  "/",
];

/**
 * Rota padrão para redirecionamento após login
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
