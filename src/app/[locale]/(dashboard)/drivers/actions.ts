"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

const driverSchema = z.object({
  depotId: z.string().min(1, "Depot ID is required"),
  fullName: z.string().min(1, "fullName is required"),
  licenseUntil: z.coerce.date(),
});

export const createDriver = async (
  prevState: { error: string | null; success: boolean },
  data: FormData,
) => {
  const t = await getTranslations("Errors");
  const session = await auth();
  if (!session) {
    return { error: t("unauthenticated"), success: false };
  }

  const depotId = data.get("depotId") as string;
  const fullName = data.get("fullName") as string;
  const licenseUntilRaw = data.get("licenseUntil") as string;
  const licenseUntil = licenseUntilRaw ? new Date(licenseUntilRaw) : undefined;

  const validationResult = driverSchema.safeParse({ depotId, fullName, licenseUntil });

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map((err) => err.message).join(", ");
    return { error: t("validationFailed", { message: errorMessages }), success: false };
  }

  const depot = await prisma.depot.findFirst({
    where: { id: validationResult.data.depotId, tenantId: session?.user?.tenantId },
  });

  if (!depot) {
    return { error: t("depotNotFound"), success: false };
  }

  await prisma.driver.create({
    data: {
      depotId: validationResult.data.depotId,
      fullName: validationResult.data.fullName,
      licenseUntil: validationResult.data.licenseUntil,
    },
  });

  const locale = await getLocale();
  revalidatePath(`/${locale}/drivers`);

  return { error: null, success: true };
};

export const updateDriver = async (
  driverId: string,
  prevState: { error: string | null; success: boolean },
  data: FormData,
) => {
  const t = await getTranslations("Errors");
  const session = await auth();
  if (!session) {
    return { error: t("unauthenticated"), success: false };
  }

  const depotId = data.get("depotId") as string;
  const fullName = data.get("fullName") as string;
  const licenseUntilRaw = data.get("licenseUntil") as string;
  const licenseUntil = licenseUntilRaw ? new Date(licenseUntilRaw) : undefined;

  const validationResult = driverSchema.safeParse({ depotId, fullName, licenseUntil });

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map((err) => err.message).join(", ");
    return { error: t("validationFailed", { message: errorMessages }), success: false };
  }

  const depot = await prisma.depot.findFirst({
    where: { id: validationResult?.data?.depotId, tenantId: session?.user?.tenantId },
  });

  if (!depot) {
    return { error: t("depotNotFound"), success: false };
  }

  await prisma.driver.update({
    where: { id: driverId },
    data: {
      depotId: validationResult.data.depotId,
      fullName: validationResult.data.fullName,
      licenseUntil: validationResult.data.licenseUntil,
    },
  });

  const locale = await getLocale();
  revalidatePath(`/${locale}/drivers`);

  return { error: null, success: true };
};

export const deleteDriver = async (
  driverId: string,
  prevState: { error: string | null; success: boolean },
) => {
  const t = await getTranslations("Errors");
  const session = await auth();
  if (!session) {
    return { error: t("unauthenticated"), success: false };
  }

  try {
    const result = await prisma.driver.deleteMany({
      where: { id: driverId, depot: { tenantId: session?.user?.tenantId } },
    });

    if (result.count === 0) {
      return { error: t("driverNotFound"), success: false };
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("foreign key constraint")) {
      return {
        error: t("driverRelation"),
        success: false,
      };
    }
    throw err;
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/drivers`);

  return { error: null, success: true };
};
