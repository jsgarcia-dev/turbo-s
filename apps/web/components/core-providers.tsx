"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import TopLoader from "./top-loader";

const queryClient = new QueryClient();

export default function CoreProviders({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        {...props}
      >
        <TopLoader />
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
