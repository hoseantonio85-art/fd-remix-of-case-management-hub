import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronDown, Sparkles } from "lucide-react";
import { counterparties, type Counterparty } from "@/lib/mock-data";
import { CounterpartyModal } from "@/components/counterparty/CounterpartyModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Контрагенты — НОРМ" },
      { name: "description", content: "Управление контрагентами и работа с дебиторской задолженностью" },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState<Counterparty | null>(null);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">Контрагенты</h1>
            <span className="text-sm text-muted-foreground">1002</span>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Найти…"
              className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* AI banner */}
        <div className="mb-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/5 to-transparent p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium">
                Я проанализировал дебиторскую задолженность на 30.09.2025: в зоне внимания 5 дебиторов и 3,9 млн ₽
              </div>
              <div className="mt-0.5 text-muted-foreground">
                Оценивается задолженность ЮЛ и ИП, зарегистрированных на территории РФ, с задолженностью свыше 10 млн
              </div>
            </div>
          </div>
        </div>

        {/* Debtor list */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Список дебиторов</h2>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {["Ухудшилось фин. состояние", "Банкротство/ликвидация", "Просрочена задолженность в группе"].map((f) => (
            <button
              key={f}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
            >
              {f}
              <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">5</span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {counterparties.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className="w-full rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                    {c.tag}
                  </div>
                  <div className="mt-2 text-lg font-semibold">{c.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <ChevronDown className="h-3 w-3" />
                    {c.inn} · {c.contracts.length} договора
                  </div>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs text-muted-foreground">Задолженность</div>
                    <div className="text-base font-semibold">{c.totalDebt}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Просроченная</div>
                    <div className="text-base font-semibold text-destructive">{c.overdueDebt}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <CounterpartyModal
        counterparty={active}
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </div>
  );
}
