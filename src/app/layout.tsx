import type { Metadata } from "next";
import "./globals.css";
import { getLocale } from "next-intl/server";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Trekker",
  description: "Multi-tenant filo ve sevkiyat yönetim platformu",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
