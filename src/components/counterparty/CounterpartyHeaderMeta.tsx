import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  defaultOgrn,
  defaultRegistrationInfo,
  type RegistrationInfo,
} from "./RegistrationInfoWidget";
import { InModalDrawer } from "./InModalDrawer";

export type ExtraRow = { label: string; value: React.ReactNode };

/**
 * Shared "ИНН ... · Действующая" subtitle + "Подробнее" text button that opens
 * a drawer with the full counterparty meta information.
 */
export function CounterpartyHeaderMeta({
  inn,
  ogrn = defaultOgrn,
  status = "Действующая",
  registrationInfo = defaultRegistrationInfo,
  extraRows = [],
  className,
}: {
  inn: string;
  ogrn?: string;
  status?: string;
  registrationInfo?: RegistrationInfo;
  extraRows?: ExtraRow[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const rows: ExtraRow[] = [
    { label: "ИНН", value: inn },
    { label: "ОГРН", value: ogrn },
    {
      label: "Дата регистрации",
      value: `${registrationInfo.registrationDate} (${registrationInfo.businessAge})`,
    },
    {
      label: "Основной ОКВЭД",
      value: `${registrationInfo.okvedCode} · ${registrationInfo.okvedName}`,
    },
    { label: "Юридический адрес", value: registrationInfo.legalAddress },
    { label: "Текущий статус ЕГРЮЛ", value: registrationInfo.egrulStatus },
    ...extraRows,
  ].filter((r) => r.value !== undefined && r.value !== null && r.value !== "");

  return (
    <div className={cn("mt-1", className)}>
      <p className="text-xs text-muted-foreground">
        ИНН {inn} · {status}
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1 inline-flex items-center text-xs font-medium text-muted-foreground underline-offset-2 transition hover:text-foreground hover:underline"
      >
        Подробнее
      </button>

      <InModalDrawer open={open} onOpenChange={setOpen}>
        <div className="p-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Информация о контрагенте
          </h2>
          <div className="mt-1 text-xs text-muted-foreground">
            ИНН {inn} · {status}
          </div>

          <ul className="mt-5 divide-y divide-border">
            {rows.map((r) => (
              <li key={r.label} className="py-2.5 first:pt-0 last:pb-0">
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {r.label}
                </div>
                <div className="mt-0.5 text-sm leading-snug text-foreground break-words">
                  {r.value}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </InModalDrawer>
    </div>
  );
}
