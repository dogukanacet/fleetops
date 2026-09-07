import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const routes = await getTranslations("Routes");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md space-y-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-destructive">{t("routeTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("routeDescription")}</p>
        </div>
        <Link
          href="/routes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {routes("back")}
        </Link>
      </div>
    </div>
  );
}
