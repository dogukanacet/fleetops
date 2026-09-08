"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

export const SessionRefresher = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const isRefreshing = useRef(false); // preventing multiple refresh calls

  useEffect(() => {
    if (session?.error === "AccessTokenExpired" && !isRefreshing.current) {
      isRefreshing.current = true;

      fetch("/api/auth/refresh", { method: "POST" })
        .then((response) => {
          if (response.ok) {
            console.log("refresh ok");
            router.refresh();
          } else {
            signOut({ callbackUrl: `/${locale}/login` });
          }
        })
        .finally(() => {
          isRefreshing.current = false;
        });
    }
  }, [session, router]);

  return null;
};
