"use client";

import { useActionState, useEffect, useState } from "react";
import type { Depot } from "@prisma/client";
import * as driverActions from "@/app/[locale]/(dashboard)/drivers/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

export function AddDriverDialog({ depotList }: { depotList: Depot[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Drivers");
  const common = useTranslations("Common");
  const [actionState, formAction, isPending] = useActionState(driverActions.createDriver, {
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
            <Label htmlFor="fullName">{t("name")}</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseUntil">{t("licenseUntil")}</Label>
            <Input id="licenseUntil" name="licenseUntil" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="depotId">{t("depot")}</Label>
            <Select name="depotId" required>
              <SelectTrigger id="depotId">
                <SelectValue>
                  {(value: string | null) =>
                    value ? depotList.find((d) => d.id === value)?.name : common("selectDepot")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {depotList.map((depot) => (
                  <SelectItem key={depot.id} value={depot.id}>
                    {depot.name}
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
