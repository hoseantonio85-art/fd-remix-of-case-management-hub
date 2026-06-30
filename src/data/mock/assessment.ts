// Mock-данные оценки контрагента и builder для них.
// Единый источник критериев для всех сценариев отображения оценки:
// - обычная модалка оценки контрагента,
// - модалка результата проверки только по ИНН,
// - вкладка «Проверка контрагента» в комплексной проверке.
import type {
  Assessment,
  AssessmentCriterion,
  AssessmentGroup,
  AssessmentSource,
} from "@/domain/assessment";

const NO_DATA_REASON = "Нет данных для проверки";
const OK_REASON = "Нарушений не выявлено";

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
    ok(1, "Ликвидация или реорганизация"),
    risk(2, "Банкротство ЮЛ", "Имеется иск к компании о признании ее несостоятельной (банкротом)"),
    nd(3, "Деятельность приостановлена по КоАП РФ"),
    nd(4, "Решение о приостановлении деятельности"),
    nd(5, "Ограничения по счетам от ФНС"),
    ok(6, "Недостоверный адрес в ЕГРЮЛ"),
    nd(7, "Адрес массовой регистрации"),
    nd(8, "Смена юрадреса в течение года"),
    nd(9, "С даты регистрации менее 6 месяцев"),
    nd(10, "Отсутствие нужных ОКВЭД под договор"),
  ],
};

const management: AssessmentGroup = {
  id: "management",
  title: "Руководство и бенефициары",
  description: "Проверка руководства и бенефициаров",
  criteria: [
    ok(1, "Дисквалификация руководителей"),
    ok(2, "Недостоверные сведения о руководителе/учредителе"),
    ok(3, "Банкротство физлица (руководитель/учредитель)"),
    nd(4, "Судимость за экономические преступления"),
    nd(5, "Иностранные учредители/руководители"),
    nd(6, "Совпадение учредителя и руководителя"),
    ok(7, "Массовость руководителя"),
    ok(8, "Массовость учредителя"),
    ok(9, "Смена руководителя в течение года"),
    nd(10, "Смена управляющей компании в течение года"),
  ],
};

const finance: AssessmentGroup = {
  id: "finance",
  title: "Финансы и налоги",
  description: "Проверка финансов и налогов",
  criteria: [
    ok(1, "Непредставление налоговой отчётности более 1 года"),
    nd(2, "Неоплаченная налоговая задолженность"),
    nd(3, "Высокая доля вычитаемого НДС"),
    nd(4, "Обязательства более 30% выручки"),
    nd(5, "Снижение выручки более 50%"),
    nd(6, "Недостаточная численность работников"),
    nd(7, "Уставной капитал не более 50 тыс. руб."),
    nd(8, "С даты регистрации прошло 12 месяцев"),
    nd(9, "Положительный опыт с компаниями холдинга"),
    nd(10, "Наличие госконтрактов"),
    risk(
      11,
      "Финансовый анализ на данных отчётности",
      "Выявлены признаки прекращения финансово-хозяйственной деятельности, критическое финансовое состояние, умеренный уровень долговой нагрузки, а также проблемы с погашением кредиторской и дебиторской задолженности с отсрочкой",
    ),
  ],
};

const legalReputation: AssessmentGroup = {
  id: "legal_reputation",
  title: "Судебная нагрузка и репутация",
  description: "Проверка судебной нагрузки и репутации",
  criteria: [
    ok(1, "Терроризм / экстремизм"),
    nd(2, "Список иноагентов"),
    ok(3, "Административная ответственность ст. 19.28 КоАП"),
    ok(4, "Недобросовестный поставщик"),
    nd(5, "Исполнительные производства более 10% выручки"),
    nd(6, "Значительные арбитражные дела (ответчик)"),
    nd(7, "Требования к ответчику более 10% выручки"),
    nd(8, "Налоговый спор в суде"),
    nd(9, "Банкротство физлица-ИП за 12 мес."),
    nd(10, "Претензии / санкции от госорганов"),
    risk(11, "Иная негативная репутационная информация", "Выявлен негатив по компании"),
    risk(
      12,
      "Информация об арбитражных исках",
      "Имеется иск к компании о признании ее несостоятельной (банкротом), а также завершены менее 1 года назад иски о ненадлежащем исполнении обязательств по договорам",
    ),
  ],
};

export const defaultGroups: AssessmentGroup[] = [legalStatus, management, finance, legalReputation];

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
