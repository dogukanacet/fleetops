"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { issueRefreshToken } from "@/lib/refresh-token";
import { AuthError } from "next-auth";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { getRefreshTokenExpiryMs, setRefreshCookie } from "@/lib/refresh-cookie";

export async function loginAction(formData: FormData) {
  const locale = await getLocale();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) throw new Error("couldnt get session info");

    const refreshToken = await issueRefreshToken(user.id);

    const expiresIn = getRefreshTokenExpiryMs();
    await setRefreshCookie(refreshToken, expiresIn);
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error("Invalid email or password");
    }

    throw error;
  }

  redirect({ href: "/", locale });
}
