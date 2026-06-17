import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  defaultOgrn,
  defaultRegistrationInfo,
  type RegistrationInfo,
} from "./RegistrationInfoWidget";

export type ExtraRow = { label: string; value: React.ReactNode };

/**
 * Shared "ИНН ... · Действующая" subtitle + "Подробнее" toggle that reveals the
 * counterparty meta information (registration data). Used across counterparty
 * modals/drawers to keep the header pattern identical.
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
  ];

  return (
    <div className={cn("mt-1", className)}>
      <p className="text-xs text-muted-foreground">
        ИНН {inn} · {status}
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        {open ? "Свернуть" : "Подробнее"}
        <ChevronDown className={cn("h-3 w-3 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-border bg-white/70 p-3 backdrop-blur-sm">
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.label} className="py-2 first:pt-0 last:pb-0">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {r.label}
                </div>
                <div className="mt-0.5 text-xs leading-snug text-foreground break-words">
                  {r.value}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
