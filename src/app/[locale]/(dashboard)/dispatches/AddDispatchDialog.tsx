"use client";

import { useActionState, useEffect, useState } from "react";
import type { Vehicle, Driver, Route } from "@prisma/client";
import * as dispatchActions from "@/app/[locale]/(dashboard)/dispatches/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function AddDispatchDialog({
  vehicleList,
  driverList,
  routeList,
}: {
  vehicleList: Vehicle[];
  driverList: Driver[];
  routeList: Route[];
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Dispatches");
  const common = useTranslations("Common");
  const [actionState, formAction, isPending] = useActionState(dispatchActions.createDispatch, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (actionState.success) {
      toast.success(t("added"));
      setOpen(false);
    }
  }, [actionState.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4" />
        {t("add")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("new")}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">{t("vehicle")}</Label>
            <Select name="vehicleId" required>
              <SelectTrigger id="vehicleId">
                <SelectValue>
                  {(value: string | null) => {
                    const vehicle = vehicleList.find((v) => v.id === value);
                    return vehicle
                      ? `${vehicle.plate} — ${vehicle.model ?? ""}`
                      : t("selectVehicle");
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vehicleList.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} — {vehicle.model ?? "—"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="driverId">{t("driver")}</Label>
            <Select name="driverId" required>
              <SelectTrigger id="driverId">
                <SelectValue>
                  {(value: string | null) =>
                    value ? driverList.find((d) => d.id === value)?.fullName : t("selectDriver")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {driverList.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="routeId">{t("route")}</Label>
            <Select name="routeId" required>
              <SelectTrigger id="routeId">
                <SelectValue>
                  {(value: string | null) =>
                    value ? routeList.find((r) => r.id === value)?.name : t("selectRoute")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {routeList.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {actionState.error && <p className="text-sm text-destructive">{actionState.error}</p>}
          <DialogFooter>
            <Button type="submit">{common("add")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
