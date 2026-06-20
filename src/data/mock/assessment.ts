// Mock-данные оценки контрагента и builder для них.
// В будущей итерации заменяется на http-реализацию через AssessmentRepository.
import type {
  Assessment,
  AssessmentCriterion,
  AssessmentGroup,
  AssessmentSource,
} from "@/domain/assessment";

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

export const defaultGroups: AssessmentGroup[] = [
  legalStatus,
  management,
  finance,
  legalReputation,
];

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
