"use client";

import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { Vehicle, Driver, Route, Dispatch } from "@prisma/client";
import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import { useTheme } from "next-themes";
import { dispatchStatusColors } from "@/lib/status-colors";
import * as dispatchActions from "@/app/[locale]/(dashboard)/dispatches/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EditDispatchDialog } from "@/app/[locale]/(dashboard)/dispatches/EditDispatchDialog";
import { useTranslations } from "next-intl";

type DispatchRow = Dispatch & {
  vehicle?: { plate: string } | null;
  driver?: { fullName: string } | null;
  route?: { name: string } | null;
};

const trekkerGridTheme = themeQuartz.withParams({
  accentColor: "#4f46e5",
  backgroundColor: "var(--card)",
  chromeBackgroundColor: "color-mix(in oklch, var(--muted) 50%, transparent)",
  foregroundColor: "var(--foreground)",
  borderColor: "var(--border)",
  headerTextColor: "var(--foreground)",
  rowHoverColor: "color-mix(in oklch, var(--muted) 50%, transparent)",
  borderRadius: 8,
  wrapperBorderRadius: 8,
});

const trekkerGridDarkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  accentColor: "#818cf8",
  backgroundColor: "var(--card)",
  chromeBackgroundColor: "color-mix(in oklch, var(--muted) 50%, transparent)",
  foregroundColor: "var(--foreground)",
  borderColor: "var(--border)",
  headerTextColor: "var(--foreground)",
  rowHoverColor: "color-mix(in oklch, var(--muted) 50%, transparent)",
  borderRadius: 8,
  wrapperBorderRadius: 8,
});

const DispatchGrid = ({
  dispatches,
  vehicleList,
  driverList,
  routeList,
}: {
  dispatches: DispatchRow[];
  vehicleList: Vehicle[];
  driverList: Driver[];
  routeList: Route[];
}) => {
  const { resolvedTheme } = useTheme();
  const t = useTranslations("Dispatches");
  const common = useTranslations("Common");
  const [editingRow, setEditingRow] = useState<DispatchRow | null>(null);
  const [rowToDelete, setRowToDelete] = useState<DispatchRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!rowToDelete) return;
    setIsDeleting(true);
    const result = await dispatchActions.deleteDispatch(rowToDelete.id, {
      error: null,
      success: false,
    });
    setIsDeleting(false);

    if (result.success) {
      toast.success(t("deleted"));
      setRowToDelete(null);
    }
  };

  const columnDefs: ColDef<DispatchRow>[] = [
    {
      headerName: t("vehicle"),
      valueGetter: ({ data }) => data?.vehicle?.plate ?? common("notAvailable"),
    },
    {
      headerName: t("driver"),
      valueGetter: ({ data }) => data?.driver?.fullName ?? common("notAvailable"),
    },
    {
      headerName: t("route"),
      valueGetter: ({ data }) => data?.route?.name ?? common("notAvailable"),
    },
    {
      field: "status",
      headerName: t("status"),
      cellRenderer: ({ value }: { value: Dispatch["status"] }) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${dispatchStatusColors[value]}`}
        >
          {t(
            value === "PLANNED"
              ? "planned"
              : value === "IN_PROGRESS"
                ? "inProgress"
                : value === "COMPLETED"
                  ? "completed"
                  : "cancelled",
          )}
        </span>
      ),
    },
    {
      field: "date",
      headerName: t("date"),
      valueFormatter: ({ value }) =>
        value ? new Date(value).toLocaleDateString() : common("notAvailable"),
    },
    {
      headerName: common("actions"),
      width: 110,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }: { data: DispatchRow }) => (
        <div className="mlauto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setEditingRow(data)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setRowToDelete(data)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ height: 500, width: "100%" }}>
        <AgGridReact<DispatchRow>
          rowData={dispatches}
          columnDefs={columnDefs}
          theme={resolvedTheme === "dark" ? trekkerGridDarkTheme : trekkerGridTheme}
          defaultColDef={{ flex: 1 }}
        />
      </div>

      {editingRow && (
        <EditDispatchDialog
          key={editingRow.id}
          dispatch={editingRow}
          open={editingRow !== null}
          onOpenChange={(open) => !open && setEditingRow(null)}
          vehicleList={vehicleList}
          driverList={driverList}
          routeList={routeList}
        />
      )}

      <AlertDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => !open && setRowToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{common("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive"
            >
              {isDeleting ? common("deleting") : common("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DispatchGrid;
