// Доменные типы и чистая бизнес-логика оценки контрагента.

export type CriterionStatus = "risk" | "clear" | "no_data";

export const statusFromPassed = (p: boolean | null): CriterionStatus =>
  p === false ? "risk" : p === true ? "clear" : "no_data";

export const criterionStatusMeta: Record<CriterionStatus, { label: string; chip: string }> = {
  risk: { label: "Выявлен риск", chip: "bg-rose-50 text-rose-700" },
  clear: { label: "Нарушений нет", chip: "bg-emerald-50 text-emerald-700" },
  no_data: { label: "Нет данных", chip: "bg-slate-100 text-slate-600" },
};

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

const NO_DATA_REASON = "Нет данных для проверки";
const OK_REASON = "Нарушений не выявлено";

const HEAD_REASON =
  "По найденной информации за последние 6 месяцев произошла смена директора компании.";

const ok = (n: number, title: string): AssessmentCriterion => ({
  number: n,
  title,
  passed: true,
  reason: OK_REASON,
});
const nd = (n: number, title: string): AssessmentCriterion => ({
  number: n,
  title,
  passed: null,
  reason: NO_DATA_REASON,
});
const risk = (n: number, title: string, reason: string): AssessmentCriterion => ({
  number: n,
  title,
  passed: false,
  reason,
});

const legalStatus: AssessmentGroup = {
  id: "legal_status",
  title: "Юридический статус и правоспособность",
  description: "Проверка юридического статуса и правоспособности",
  criteria: [
    ok(1, "ЮЛ в процедуре банкротства / банкрот / подавало заявление"),
    ok(2, "Недостоверный адрес в ЕГРЮЛ"),
  ],
};

const management: AssessmentGroup = {
  id: "management",
  title: "Руководство и бенефициары",
  description: "Проверка руководства и бенефициаров",
  criteria: [
    ok(1, "ФИО руководителей в реестре дисквалифицированных лиц"),
    ok(2, "Недостоверные сведения о руководителе или учредителе по ФНС"),
    ok(3, "Банкротство физлица (руководитель/учредитель) за 12 мес."),
    ok(4, ">10 ЮЛ с тем же руководителем"),
    ok(5, ">10 ЮЛ с тем же учредителем-физлицом"),
    risk(6, "Смена руководителя в течение года", HEAD_REASON),
  ],
};

const finance: AssessmentGroup = {
  id: "finance",
  title: "Финансы и налоги",
  description: "Проверка финансов и налогов",
  criteria: [ok(1, "Не сдаёт налоговую отчётность >1 года")],
};

const legalReputation: AssessmentGroup = {
  id: "legal_reputation",
  title: "Судебная нагрузка и репутация",
  description: "Проверка судебной нагрузки и репутации",
  criteria: [
    ok(1, "Списки терроризма / экстремизма"),
    ok(2, "Ст. 19.28 КоАП (незаконное вознаграждение)"),
    ok(3, "Реестр недобросовестных поставщиков"),
  ],
};

export const defaultGroups: AssessmentGroup[] = [legalStatus, management, finance, legalReputation];

export const MAIN_GROUP_IDS: AssessmentGroupId[] = [
  "legal_status",
  "management",
  "finance",
  "legal_reputation",
];
export const OTHER_GROUP_IDS: AssessmentGroupId[] = [];

function toPositiveGroups(groups: AssessmentGroup[]): AssessmentGroup[] {
  return groups.map((g) => ({
    ...g,
    criteria: g.criteria.map((c) =>
      c.passed === false ? { ...c, passed: true as boolean | null, reason: OK_REASON } : { ...c },
    ),
  }));
}

export function buildAssessment(
  counterpartyName: string,
  inn: string,
  source: AssessmentSource = "auto",
  dateOverride?: string,
  variant: "negative" | "positive" = "negative",
): Assessment {
  const isPositive = variant === "positive";
  return {
    inn,
    counterpartyName,
    date: dateOverride ?? "04.06.2026",
    nextCheck: source === "auto" ? "завтра" : undefined,
    source,
    summary: isPositive
      ? "Критически значимых факторов риска не выявлено."
      : "По результатам оценки выявлены критические факторы по руководству и финансовой устойчивости.",
    changes: [],
    groups: isPositive ? toPositiveGroups(defaultGroups) : defaultGroups,
  };
}

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

export const toneStyles: Record<
  "rose" | "amber" | "slate" | "emerald",
  { dot: string; border: string; iconBg: string; iconText: string; chip: string }
> = {
  rose: {
    dot: "bg-rose-500",
    border: "border-l-rose-400",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    chip: "bg-rose-50 text-rose-700",
  },
  amber: {
    dot: "bg-amber-500",
    border: "border-l-amber-400",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    chip: "bg-amber-50 text-amber-800",
  },
  slate: {
    dot: "bg-slate-400",
    border: "border-l-slate-300",
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
    chip: "bg-slate-100 text-slate-700",
  },
  emerald: {
    dot: "bg-emerald-500",
    border: "border-l-emerald-400",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
    chip: "bg-emerald-50 text-emerald-700",
  },
};
