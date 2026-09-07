"use server";

import { signOut } from "@/lib/auth";
import { cancelRefreshToken } from "@/lib/refresh-token";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

const REFRESH_COOKIE = "trekker.refresh-token";

export async function logoutAction() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (rawToken) {
    await cancelRefreshToken(rawToken);
  }

  cookieStore.delete({ name: REFRESH_COOKIE, path: "/" });
  const locale = await getLocale();

  await signOut({ redirect: false });

  redirect({ href: "/login", locale });
}
