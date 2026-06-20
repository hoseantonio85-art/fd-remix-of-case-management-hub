// Mock CheckRepository: имитация запуска проверки с running → done переходом.
import type { CheckRecordDto, CheckRepository, CheckType } from "../types";

const RUN_DURATION_MS = Number(import.meta.env.VITE_MOCK_CHECK_DURATION_MS ?? 5000);

let store: CheckRecordDto[] = [];
const listeners = new Set<(records: CheckRecordDto[]) => void>();

const notify = () => {
  const snapshot = store.map((c) => ({ ...c }));
  for (const l of listeners) l(snapshot);
};

const timers = new Map<string, ReturnType<typeof setTimeout>>();

function resolveType(input: { inn?: string; fileNames: string[]; type?: CheckType }): CheckType {
  if (input.type) return input.type;
  const hasInn = !!input.inn;
  const hasFiles = input.fileNames.length > 0;
  return hasInn && hasFiles ? "complex" : hasInn ? "counterparty" : "contract";
}

export const mockCheckRepository: CheckRepository = {
  async list() {
    return store.map((c) => ({ ...c }));
  },
  async run({ inn, fileNames, type }) {
    const recordType = resolveType({ inn, fileNames, type });
    const id = `check-${inn || "contract"}-${Date.now()}`;
    const rec: CheckRecordDto = {
      id,
      inn: inn || undefined,
      fileNames: [...fileNames],
      status: "running",
      createdAt: Date.now(),
      type: recordType,
    };
    store = [rec, ...store];
    notify();
    const timer = setTimeout(() => {
      store = store.map((c) => (c.id === id ? { ...c, status: "done" } : c));
      timers.delete(id);
      notify();
    }, RUN_DURATION_MS);
    timers.set(id, timer);
    return { ...rec };
  },
  async remove(id) {
    const t = timers.get(id);
    if (t) {
      clearTimeout(t);
      timers.delete(id);
    }
    store = store.filter((c) => c.id !== id);
    notify();
  },
  subscribe(listener) {
    listeners.add(listener);
    listener(store.map((c) => ({ ...c })));
    return () => listeners.delete(listener);
  },
};
