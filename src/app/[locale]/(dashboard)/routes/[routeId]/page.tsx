import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { typography } from "@/lib/constants";
import RouteExplorer from "./RouteExplorer";
import { getTranslations } from "next-intl/server";

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await params;
  const session = await auth();

  const routeData = await prisma.route.findFirst({
    where: { id: routeId, depot: { tenantId: session?.user?.tenantId } },
    include: { stops: { orderBy: { order: "asc" } } },
  });
  const t = await getTranslations("Routes");

  if (!routeData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/routes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>
        <h1 className={`${typography.pageTitle} mt-2`}>{routeData.name}</h1>
      </div>
      <RouteExplorer stops={routeData.stops} routeId={routeData.id} />
    </div>
  );
}
