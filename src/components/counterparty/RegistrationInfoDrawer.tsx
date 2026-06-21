import { InModalDrawer } from "./InModalDrawer";
import {
  type RegistrationInfo,
  defaultRegistrationInfo,
  defaultOgrn,
} from "./RegistrationInfoWidget";

export function RegistrationInfoDrawer({
  open,
  onOpenChange,
  counterpartyName,
  inn,
  ogrn,
  registrationInfo = defaultRegistrationInfo,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  counterpartyName: string;
  inn: string;
  ogrn?: string;
  registrationInfo?: RegistrationInfo;
}) {
  const ogrnValue = ogrn ?? defaultOgrn;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "ИНН", value: inn },
    { label: "ОГРН", value: ogrnValue },
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
  ];

  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="p-6">
        <div className="pr-16">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Регистрационные данные
          </h2>
          <div className="mt-1 text-sm text-muted-foreground">{counterpartyName}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            ИНН {inn} · ОГРН {ogrnValue}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white p-4">
          <ul className="divide-y divide-border">
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
      </div>
    </InModalDrawer>
  );
}
