import { useCallback, useEffect, useState } from "react";
import type { CheckRecordDto, CheckType } from "@/data/repositories";
import { checkRepository } from "@/data/repositories";

export interface UseChecksResult {
  checks: CheckRecordDto[];
  loading: boolean;
  error: Error | null;
  runningCount: number;
  doneCount: number;
  run: (input: { inn?: string; fileNames: string[]; type?: CheckType }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  retry: () => Promise<void>;
}

function upsert(list: CheckRecordDto[], rec: CheckRecordDto): CheckRecordDto[] {
  const idx = list.findIndex((c) => c.id === rec.id);
  if (idx === -1) return [rec, ...list];
  const copy = list.slice();
  copy[idx] = rec;
  return copy;
}

export function useChecks(): UseChecksResult {
  const [checks, setChecks] = useState<CheckRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await checkRepository.list();
      setChecks(list);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Первичная загрузка — всегда через list(). subscribe() используется
  // дополнительно для live-обновлений (running → done, изменения от других клиентов).
  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const unsubscribe = checkRepository.subscribe((records) => {
      setChecks(records);
    });
    return unsubscribe;
  }, []);

  const run = useCallback(
    async (input: { inn?: string; fileNames: string[]; type?: CheckType }) => {
      setError(null);
      try {
        const created = await checkRepository.run({
          inn: input.inn,
          fileNames: input.fileNames,
          type: input.type ?? "counterparty",
        });
        // Работает и без live-транспорта: дедуплицируем по id.
        setChecks((prev) => upsert(prev, created));
      } catch (e) {
        setError(e as Error);
        throw e;
      }
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await checkRepository.remove(id);
      setChecks((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  }, []);

  return {
    checks,
    loading,
    error,
    runningCount: checks.filter((c) => c.status === "running").length,
    doneCount: checks.filter((c) => c.status === "done").length,
    run,
    remove,
    retry: load,
  };
}
