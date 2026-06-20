import type { Counterparty, RiskSignal, Contract, CollectionSubStep } from "@/domain/counterparty";
import { counterpartiesMock } from "@/data/mock/counterparties";
import type { CounterpartyRepository } from "../types";

const LATENCY_MS = Number(import.meta.env.VITE_MOCK_LATENCY_MS ?? 250);
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

let store: Counterparty[] = counterpartiesMock.map((c) => ({ ...c }));

const patch = (inn: string, fn: (cp: Counterparty) => Counterparty) => {
  store = store.map((c) => (c.inn === inn ? fn(c) : c));
};

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
  async add(cp) {
    await sleep(LATENCY_MS / 2);
    if (!store.some((c) => c.inn === cp.inn)) store = [cp, ...store];
  },
  async updateStatus(inn, status) {
    await sleep(LATENCY_MS / 2);
    patch(inn, (c) => ({ ...c, status }));
  },
  async saveRiskDecision(inn, risk: RiskSignal) {
    await sleep(LATENCY_MS / 2);
    patch(inn, (c) => {
      const exists = c.risks.some((r) => r.id === risk.id);
      return {
        ...c,
        risks: exists ? c.risks.map((r) => (r.id === risk.id ? risk : r)) : [...c.risks, risk],
      };
    });
  },
  async addOrUpdateContract(inn, contract: Contract) {
    await sleep(LATENCY_MS / 2);
    patch(inn, (c) => {
      const exists = c.contracts.some((k) => k.id === contract.id);
      return {
        ...c,
        contracts: exists
          ? c.contracts.map((k) => (k.id === contract.id ? contract : k))
          : [...c.contracts, contract],
      };
    });
  },
  async updateCollectionStep(inn, step: CollectionSubStep) {
    await sleep(LATENCY_MS / 2);
    patch(inn, (c) => ({
      ...c,
      collection: c.collection.map((s) => (s.id === step.id ? step : s)),
    }));
  },
};
