import type { Counterparty, RiskSignal } from "@/domain/counterparty";
import { counterpartiesMock } from "@/data/mock/counterparties";
import type { CounterpartyRepository } from "../types";

// Имитация сетевой задержки — управляется через VITE_MOCK_LATENCY_MS.
const LATENCY_MS = Number(import.meta.env.VITE_MOCK_LATENCY_MS ?? 250);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// In-memory store (мутируется только репозиторием).
let store: Counterparty[] = counterpartiesMock.map((c) => ({ ...c }));

export const mockCounterpartyRepository: CounterpartyRepository = {
  async list() {
    await sleep(LATENCY_MS);
    return store.map((c) => ({ ...c }));
  },
  async byInn(inn) {
    await sleep(LATENCY_MS);
    const found = store.find((c) => c.inn === inn);
    return found ? { ...found } : null;
  },
  async updateStatus(inn, status) {
    await sleep(LATENCY_MS / 2);
    store = store.map((c) => (c.inn === inn ? { ...c, status } : c));
  },
  async addRisk(inn, risk: RiskSignal) {
    await sleep(LATENCY_MS / 2);
    store = store.map((c) => (c.inn === inn ? { ...c, risks: [...c.risks, risk] } : c));
  },
};
