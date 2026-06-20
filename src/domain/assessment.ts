// Доменные типы и чистые агрегаторы оценки контрагента.
// UI-presentation вынесена в `@/components/counterparty/assessment-ui`,
// mock-данные — в `@/data/mock/assessment`.

export type CriterionStatus = "risk" | "clear" | "no_data";

export const statusFromPassed = (p: boolean | null): CriterionStatus =>
  p === false ? "risk" : p === true ? "clear" : "no_data";

export type AssessmentCriterion = {
  number: number;
  title: string;
  passed: boolean | null;
  reason: string;
  source?: string;
};

export type AssessmentGroupId = "legal_status" | "management" | "finance" | "legal_reputation";

export type AssessmentGroup = {
  id: AssessmentGroupId;
  title: string;
  description: string;
  criteria: AssessmentCriterion[];
};

export type AssessmentChange = {
  text: string;
  tone: "rose" | "amber" | "slate" | "emerald";
};

export type AssessmentSource = "auto" | "manual";

export type Assessment = {
  inn: string;
  counterpartyName: string;
  date: string;
  nextCheck?: string;
  source: AssessmentSource;
  summary: string;
  changes: AssessmentChange[];
  groups: AssessmentGroup[];
};

export const MAIN_GROUP_IDS: AssessmentGroupId[] = [
  "legal_status",
  "management",
  "finance",
  "legal_reputation",
];
export const OTHER_GROUP_IDS: AssessmentGroupId[] = [];

export type GroupCounts = { risk: number; clear: number; no_data: number };

export function groupCounts(g: AssessmentGroup): GroupCounts {
  let risk = 0;
  let clear = 0;
  let no_data = 0;
  for (const c of g.criteria) {
    if (c.passed === false) risk++;
    else if (c.passed === true) clear++;
    else no_data++;
  }
  return { risk, clear, no_data };
}

export function sumGroupCounts(groups: AssessmentGroup[]): GroupCounts {
  return groups.reduce<GroupCounts>(
    (acc, g) => {
      const c = groupCounts(g);
      acc.risk += c.risk;
      acc.clear += c.clear;
      acc.no_data += c.no_data;
      return acc;
    },
    { risk: 0, clear: 0, no_data: 0 },
  );
}
