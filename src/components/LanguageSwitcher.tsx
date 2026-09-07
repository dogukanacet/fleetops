"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Common");

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        if (value) router.replace(pathname, { locale: value });
      }}
    >
      <SelectTrigger aria-label={t("language")} size="sm">
        <Globe className="h-4 w-4" />
        <SelectValue>{(value: string) => value.toUpperCase()}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((option) => (
          <SelectItem key={option} value={option}>
            {option.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
