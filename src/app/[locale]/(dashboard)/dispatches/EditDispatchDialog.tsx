"use client";

import { useActionState, useEffect } from "react";
import type { Vehicle, Driver, Route, Dispatch, DispatchStatus } from "@prisma/client";
import * as dispatchActions from "@/app/[locale]/(dashboard)/dispatches/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type DispatchRow = Dispatch & {
  vehicle?: { plate: string } | null;
  driver?: { fullName: string } | null;
  route?: { name: string } | null;
};

export function EditDispatchDialog({
  dispatch,
  open,
  onOpenChange,
  vehicleList,
  driverList,
  routeList,
}: {
  dispatch: DispatchRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleList: Vehicle[];
  driverList: Driver[];
  routeList: Route[];
}) {
  const t = useTranslations("Dispatches");
  const common = useTranslations("Common");
  const statusOptions: { value: DispatchStatus; label: string }[] = [
    { value: "PLANNED", label: t("planned") },
    { value: "IN_PROGRESS", label: t("inProgress") },
    { value: "COMPLETED", label: t("completed") },
    { value: "CANCELLED", label: t("cancelled") },
  ];
  const [actionState, formAction, isPending] = useActionState(
    dispatchActions.updateDispatch.bind(null, dispatch.id),
    { error: null, success: false },
  );

  useEffect(() => {
    if (actionState.success) {
      toast.success(t("updated"));
      onOpenChange(false);
    }
  }, [actionState.success]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("edit")}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">{t("vehicle")}</Label>
            <Select name="vehicleId" defaultValue={dispatch.vehicleId}>
              <SelectTrigger id="vehicleId">
                <SelectValue>
                  {(value: string) => {
                    const vehicle = vehicleList.find((v) => v.id === value);
                    return vehicle ? `${vehicle.plate} — ${vehicle.model ?? ""}` : "";
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
            <Select name="driverId" defaultValue={dispatch.driverId}>
              <SelectTrigger id="driverId">
                <SelectValue>
                  {(value: string) => driverList.find((d) => d.id === value)?.fullName}
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
            <Select name="routeId" defaultValue={dispatch.routeId}>
              <SelectTrigger id="routeId">
                <SelectValue>
                  {(value: string) => routeList.find((r) => r.id === value)?.name}
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
          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select name="status" defaultValue={dispatch.status}>
              <SelectTrigger id="status">
                <SelectValue>
                  {(value: DispatchStatus) =>
                    statusOptions.find((option) => option.value === value)?.label
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {actionState.error && <p className="text-sm text-destructive">{actionState.error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? common("updating") : common("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
