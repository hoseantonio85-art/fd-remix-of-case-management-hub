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

  useEffect(() => {
    const unsubscribe = checkRepository.subscribe((records) => {
      setChecks(records);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const run = useCallback(
    async (input: { inn?: string; fileNames: string[]; type?: CheckType }) => {
      try {
        await checkRepository.run({
          inn: input.inn,
          fileNames: input.fileNames,
          type: input.type ?? "counterparty",
        });
      } catch (e) {
        setError(e as Error);
      }
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    try {
      await checkRepository.remove(id);
    } catch (e) {
      setError(e as Error);
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
