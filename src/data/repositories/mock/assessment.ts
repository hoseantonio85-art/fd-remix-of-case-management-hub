import { buildAssessment } from "@/data/mock/assessment";
import type { AssessmentRepository } from "../types";

const LATENCY_MS = Number(import.meta.env.VITE_MOCK_LATENCY_MS ?? 250);
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockAssessmentRepository: AssessmentRepository = {
  async buildFor(name, inn, source = "auto", variant = "negative") {
    await sleep(LATENCY_MS);
    return buildAssessment(name, inn, source, undefined, variant);
  },
};
