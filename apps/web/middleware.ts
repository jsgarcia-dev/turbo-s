import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { authRoutes, publicRoutes, DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora rotas de recursos estáticos e API
  const isPublicFile = /\.(.*)$/.test(pathname);
  const isApiRoute = pathname.startsWith("/api");

  if (isPublicFile || isApiRoute) {
    return NextResponse.next();
  }

  // Verifica se é uma rota pública ou de autenticação
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  const sessionCookie = getSessionCookie(request);

  // Se o usuário está autenticado e tenta acessar uma rota de auth
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  // Se o usuário não está autenticado e tenta acessar uma rota privada
  if (!sessionCookie && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};
