import { useCallback, useState } from "react";
import type { Assessment, AssessmentSource } from "@/domain/assessment";
import { assessmentRepository } from "@/data/repositories";

export interface UseAssessmentResult {
  assessment: Assessment | null;
  loading: boolean;
  error: Error | null;
  run: (
    name: string,
    inn: string,
    opts?: { source?: AssessmentSource; variant?: "negative" | "positive" },
  ) => Promise<Assessment | null>;
  reset: () => void;
}

export function useAssessment(): UseAssessmentResult {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (
      name: string,
      inn: string,
      opts?: { source?: AssessmentSource; variant?: "negative" | "positive" },
    ) => {
      setLoading(true);
      setError(null);
      // Сбрасываем предыдущий результат, чтобы старая оценка не воспринималась как актуальная.
      setAssessment(null);
      try {
        const a = await assessmentRepository.buildFor(
          name,
          inn,
          opts?.source ?? "auto",
          opts?.variant ?? "negative",
        );
        setAssessment(a);
        return a;
      } catch (e) {
        setError(e as Error);
        setAssessment(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setAssessment(null);
    setError(null);
  }, []);

  return { assessment, loading, error, run, reset };
}
