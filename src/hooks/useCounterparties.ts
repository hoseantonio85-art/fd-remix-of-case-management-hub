import { useCallback, useEffect, useMemo, useState } from "react";
import type { Counterparty, ProcessStage } from "@/domain/counterparty";
import { searchCounterparties } from "@/domain/counterparty";
import { counterpartyRepository } from "@/data/repositories";

export type LoadStatus = "idle" | "loading" | "refreshing" | "success" | "error" | "empty";

export interface CounterpartiesFilters {
  query: string;
  selectedStatuses: Set<Counterparty["status"]>;
  processStage: ProcessStage | null;
}

const defaultFilters: CounterpartiesFilters = {
  query: "",
  selectedStatuses: new Set(),
  processStage: null,
};

// Поддержка имитации состояний из preview: `?state=loading|error|empty`.
function readForcedState(): null | "loading" | "error" | "empty" {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const v = params.get("state");
  if (v === "loading" || v === "error" || v === "empty") return v;
  return null;
}

export interface UseCounterpartiesResult {
  data: Counterparty[];
  filtered: Counterparty[];
  status: LoadStatus;
  error: Error | null;
  filters: CounterpartiesFilters;
  setQuery: (q: string) => void;
  setSelectedStatuses: (s: Set<Counterparty["status"]>) => void;
  setProcessStage: (s: ProcessStage | null) => void;
  refetch: () => Promise<void>;
  updateStatus: (inn: string, status: Counterparty["status"]) => Promise<void>;
  add: (cp: Counterparty) => Promise<void>;
}

export function useCounterparties(): UseCounterpartiesResult {
  const [data, setData] = useState<Counterparty[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<CounterpartiesFilters>(defaultFilters);

  const load = useCallback(async (mode: "loading" | "refreshing" = "loading") => {
    const forced = readForcedState();
    setError(null);
    setStatus(mode);
    if (forced === "loading") return; // зависаем в loading для preview
    try {
      if (forced === "error") {
        throw new Error("Не удалось загрузить список контрагентов (демо-режим)");
      }
      const list = forced === "empty" ? [] : await counterpartyRepository.list();
      setData(list);
      setStatus(list.length === 0 ? "empty" : "success");
    } catch (e) {
      setError(e as Error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load("loading");
  }, [load]);

  const refetch = useCallback(async () => {
    await load("refreshing");
  }, [load]);

  const setQuery = useCallback((q: string) => {
    setFilters((p) => ({ ...p, query: q }));
  }, []);
  const setSelectedStatuses = useCallback((s: Set<Counterparty["status"]>) => {
    setFilters((p) => ({ ...p, selectedStatuses: s }));
  }, []);
  const setProcessStage = useCallback((s: ProcessStage | null) => {
    setFilters((p) => ({ ...p, processStage: s }));
  }, []);

  const filtered = useMemo(() => {
    let list = data;
    if (filters.processStage) {
      list = list.filter((c) => c.processStage === filters.processStage);
    }
    if (filters.selectedStatuses.size > 0) {
      list = list.filter((c) => c.tag !== "На оценке" && filters.selectedStatuses.has(c.status));
    }
    list = searchCounterparties(list, filters.query);
    return list;
  }, [data, filters]);

  const updateStatus = useCallback(async (inn: string, st: Counterparty["status"]) => {
    setData((prev) => prev.map((c) => (c.inn === inn ? { ...c, status: st } : c)));
    await counterpartyRepository.updateStatus(inn, st);
  }, []);

  const add = useCallback(async (cp: Counterparty) => {
    setData((prev) => (prev.some((c) => c.inn === cp.inn) ? prev : [cp, ...prev]));
    setStatus((s) => (s === "empty" ? "success" : s));
    await counterpartyRepository.add(cp);
  }, []);

  return {
    data,
    filtered,
    status,
    error,
    filters,
    setQuery,
    setSelectedStatuses,
    setProcessStage,
    refetch,
    updateStatus,
    add,
  };
}
