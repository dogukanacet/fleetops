import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Route as RouteIcon, ClipboardList } from "lucide-react";
import { typography } from "@/lib/constants";

export default async function Home() {
  const t = await getTranslations("Dashboard");
  const session = await auth();
  const tenantId = session?.user?.tenantId;

  const vehicleCount = await prisma.vehicle.count({ where: { depot: { tenantId } } });
  const driverCount = await prisma.driver.count({ where: { depot: { tenantId } } });
  const routeCount = await prisma.route.count({ where: { depot: { tenantId } } });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const dispatchCount = await prisma.dispatch.count({
    where: {
      date: { gte: startOfToday, lt: startOfTomorrow },
      vehicle: { depot: { tenantId } },
    },
  });

  const cards = [
    { label: t("vehicles"), count: vehicleCount, href: "/vehicles", icon: Truck },
    { label: t("drivers"), count: driverCount, href: "/drivers", icon: Users },
    { label: t("routes"), count: routeCount, href: "/routes", icon: RouteIcon },
    {
      label: t("todaysDispatches"),
      count: dispatchCount,
      href: "/dispatches",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={typography.pageTitle}>{t("title")}</h1>
        <p className={typography.secondary}>{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="transition hover:shadow-md hover:border-primary/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={typography.secondary}>{card.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.count}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
