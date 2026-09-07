import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { typography } from "@/lib/constants";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const common = await getTranslations("Common");
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className={typography.pageTitle}>{t("title")}</h1>
      <p className={typography.secondary}>{t("description")}</p>
      <Button render={<Link href="/" />}>{common("backToDashboard")}</Button>
    </div>
  );
}
