// Состояние и действия карточки контрагента.
// Лифт state из CounterpartyModal + персистентные мутации через counterpartyRepository.
import { useEffect, useState } from "react";
import type { Contract, CollectionSubStep, Counterparty, RiskSignal } from "@/domain/counterparty";
import { counterpartyRepository } from "@/data/repositories";

export interface UseCounterpartyCardResult {
  risks: RiskSignal[];
  setRisks: React.Dispatch<React.SetStateAction<RiskSignal[]>>;
  contracts: Contract[];
  setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
  steps: CollectionSubStep[];
  setSteps: React.Dispatch<React.SetStateAction<CollectionSubStep[]>>;
  // Persistent mutations (mock repo сейчас, http в будущей итерации).
  persistRisk: (risk: RiskSignal) => Promise<void>;
  persistContract: (contract: Contract) => Promise<void>;
  persistCollectionStep: (step: CollectionSubStep) => Promise<void>;
  reset: () => void;
}

export function useCounterpartyCard(
  counterparty: Counterparty | null,
  open: boolean,
): UseCounterpartyCardResult {
  const [risks, setRisks] = useState<RiskSignal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [steps, setSteps] = useState<CollectionSubStep[]>([]);

  useEffect(() => {
    if (!counterparty || !open) return;
    setRisks((Array.isArray(counterparty.risks) ? counterparty.risks : []).map((r) => ({ ...r })));
    setContracts(
      (Array.isArray(counterparty.contracts) ? counterparty.contracts : []).map((c) => ({
        ...c,
        overdueHistory: [...(c.overdueHistory ?? [])],
      })),
    );
    setSteps(
      (Array.isArray(counterparty.collection) ? counterparty.collection : []).map((s) => ({
        ...s,
      })),
    );
  }, [counterparty, open]);

  const reset = () => {
    setRisks([]);
    setContracts([]);
    setSteps([]);
  };

  const persistRisk = async (risk: RiskSignal) => {
    if (!counterparty) return;
    await counterpartyRepository.saveRiskDecision(counterparty.inn, risk);
  };
  const persistContract = async (contract: Contract) => {
    if (!counterparty) return;
    await counterpartyRepository.addOrUpdateContract(counterparty.inn, contract);
  };
  const persistCollectionStep = async (step: CollectionSubStep) => {
    if (!counterparty) return;
    await counterpartyRepository.updateCollectionStep(counterparty.inn, step);
  };

  return {
    risks,
    setRisks,
    contracts,
    setContracts,
    steps,
    setSteps,
    persistRisk,
    persistContract,
    persistCollectionStep,
    reset,
  };
}
