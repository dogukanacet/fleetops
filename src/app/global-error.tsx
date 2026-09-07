"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import en from "../../localizations/en.json";
import tr from "../../localizations/tr.json";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const messages =
    typeof document !== "undefined" && document.documentElement.lang === "en" ? en : tr;

  return (
    <html lang="tr">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div>
            <h1 className="text-lg font-semibold">{messages.ErrorPage.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{messages.ErrorPage.description}</p>
          </div>
          <Button onClick={reset}>{messages.ErrorPage.retry}</Button>
        </div>
      </body>
    </html>
  );
}
