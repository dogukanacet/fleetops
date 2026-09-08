import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/[locale]/(dashboard)/logout/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getTranslations } from "next-intl/server";

export async function Topbar() {
  const session = await auth();
  const t = await getTranslations("Topbar");
  return (
    <header className="h-14 border-b flex items-center justify-between px-6">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {session?.user?.email}
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("logout")}
        </button>
      </form>
    </header>
  );
}
