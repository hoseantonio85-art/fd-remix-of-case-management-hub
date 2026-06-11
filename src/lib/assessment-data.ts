export type CriterionStatus = "risk" | "clear" | "no_data";

export const statusFromPassed = (p: boolean | null): CriterionStatus =>
  p === false ? "risk" : p === true ? "clear" : "no_data";

export const criterionStatusMeta: Record<
  CriterionStatus,
  { label: string; chip: string }
> = {
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

export type AssessmentGroupId =
  | "fns"
  | "efrsb"
  | "kad"
  | "fssp"
  | "rosfin"
  | "minjust"
  | "fas"
  | "sud_mvd"
  | "eis"
  | "bank";

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

const FIN_REASON =
  "По найденной информации выявлены признаки финансовой неустойчивости: оперативное погашение краткосрочных обязательств невозможно, активы сформированы в основном за счет привлеченных средств, имеется просроченная кредиторская или дебиторская задолженность.";
const HEAD_REASON =
  "По найденной информации за последние 6 месяцев произошла смена директора компании.";

// helpers
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

const fns: AssessmentGroup = {
  id: "fns",
  title: "ФНС",
  description: "Федеральная налоговая служба",
  criteria: [
    ok(1, "ЮЛ ликвидировано / в процессе ликвидации / реорганизации путём присоединения"),
    ok(2, "ЮЛ в процедуре банкротства / банкрот / подавало заявление (признак в ЕГРЮЛ)"),
    nd(3, "Деятельность приостановлена по КоАП РФ"),
    nd(4, "Решение о приостановлении деятельности организации (запись в ЕГРЮЛ)"),
    nd(5, "Наличие ограничений на операции по банковским счетам, установленных ФНС"),
    ok(6, "Недостоверный адрес в ЕГРЮЛ (признак по решению ФНС)"),
    nd(7, "Адрес массовой регистрации (данные ЕГРЮЛ, признак вычисляется)"),
    nd(8, "Смена юридического адреса в течение года"),
    nd(9, "С даты регистрации менее 6 месяцев"),
    nd(10, "С даты регистрации прошло 12 месяцев"),
    nd(11, "Отсутствие нужных ОКВЭД под договор / ТЗ"),
    ok(12, "Недостоверные сведения о руководителе или учредителе по ФНС"),
    ok(13, "ФИО руководителей в реестре дисквалифицированных лиц"),
    nd(14, "Среди учредителей/руководителей найдены иностранные лица"),
    nd(15, "Одно лицо = учредитель и руководитель"),
    ok(16, "Более 10 ЮЛ с тем же руководителем (на основе ЕГРЮЛ)"),
    ok(17, "Более 10 ЮЛ с тем же учредителем-физлицом (на основе ЕГРЮЛ)"),
    risk(18, "Смена руководителя в течение года", HEAD_REASON),
    nd(19, "Смена управляющей компании в течение года"),
    nd(20, "Уставной капитал ≤50 тыс. руб."),
    ok(21, "ЮЛ не представляет налоговую отчётность более года"),
    nd(22, "Неоплаченная налоговая задолженность"),
    nd(23, "Доля вычитаемого НДС более 89% (на основе деклараций)"),
    nd(24, "Выручка (бухгалтерская отчётность)"),
    nd(25, "Сумма предполагаемых обязательств более 30% выручки"),
    nd(26, "Существенное снижение выручки (>50% к прошлому периоду)"),
    nd(27, "Среднесписочная численность работников"),
    ok(28, "Контрагент внесён в реестр ЮЛ, привлечённых к административной ответственности по ст. 19.28 КоАП"),
    nd(29, "Бухгалтерская отчётность (все формы)"),
    nd(30, "Налоговая отчётность (декларации, расчёты)"),
    nd(31, "Госконтракты за 12 мес. при выручке >100 млн руб."),
    risk(32, "Финансовый анализ на данных отчетности (блок fin_analysis)", FIN_REASON),
  ],
};

const efrsb: AssessmentGroup = {
  id: "efrsb",
  title: "ЕФРСБ",
  description: "Единый федеральный реестр сведений о банкротстве",
  criteria: [
    ok(1, "ЮЛ в процедуре банкротства / банкрот / подавало заявление (подтверждение факта публикации)"),
    ok(2, "Наличие за 12 мес. сообщений о банкротстве физлица — руководителя, учредителя"),
    nd(3, "Наличие за 12 мес. сообщений о банкротстве физлица, являющегося ИП"),
    nd(4, "Банкротство физлица-ИП за 12 мес."),
  ],
};

const kad: AssessmentGroup = {
  id: "kad",
  title: "КАД",
  description: "Картотека арбитражных дел",
  criteria: [
    nd(1, "Решение о приостановлении деятельности (оспаривание в суде)"),
    nd(2, "Значительная сумма арбитражных дел в качестве ответчика за 12 месяцев"),
    nd(3, "Требования к ответчику >10% выручки (расчёт на основе дел + отчётности из ФНС)"),
    nd(4, "Наличие факта рассмотрения налогового спора в суде (налоговая — истец)"),
    nd(5, "Претензии / санкции от госорганов (в части арбитражных дел)"),
    ok(6, "наличие арбитражных исков (временно, пока не подключим Ирбис)"),
  ],
};

const fssp: AssessmentGroup = {
  id: "fssp",
  title: "ФССП",
  description: "Федеральная служба судебных приставов",
  criteria: [
    nd(1, "Значительная сумма исполнительных производств (>10% выручки)"),
  ],
};

const rosfin: AssessmentGroup = {
  id: "rosfin",
  title: "Росфинмониторинг",
  description: "Росфинмониторинг",
  criteria: [
    ok(1, "Контрагент в списках организаций, спонсирующих терроризм и/или экстремизм"),
  ],
};

const minjust: AssessmentGroup = {
  id: "minjust",
  title: "Минюст РФ",
  description: "Министерство юстиции РФ",
  criteria: [
    nd(1, "Контрагент в списке иноагентов"),
  ],
};

const fas: AssessmentGroup = {
  id: "fas",
  title: "ФАС",
  description: "Федеральная антимонопольная служба",
  criteria: [
    ok(1, "Контрагент в реестре недобросовестных поставщиков (44-ФЗ, 223-ФЗ)"),
  ],
};

const sudMvd: AssessmentGroup = {
  id: "sud_mvd",
  title: "Суды общей юрисдикции / МВД",
  description: "Суды общей юрисдикции / МВД",
  criteria: [
    nd(1, "Судимость руководителя / учредителя за экономические преступления (непогашенная)"),
  ],
};

const eis: AssessmentGroup = {
  id: "eis",
  title: "ЕИС",
  description: "Единая информационная система в сфере закупок",
  criteria: [
    nd(1, "Госконтракты за 12 мес. при выручке >100 млн руб. (факт наличия контрактов)"),
  ],
};

const bank: AssessmentGroup = {
  id: "bank",
  title: "Внутренние данные банка",
  description: "Внутренние данные банка",
  criteria: [
    nd(1, "Наличие ограничений по счетам от ФНС (фактическая блокировка, подтверждённая банком)"),
    nd(2, "Положительный опыт взаимодействия с компаниями холдинга"),
  ],
};

export const defaultGroups: AssessmentGroup[] = [
  fns,
  efrsb,
  kad,
  fssp,
  rosfin,
  minjust,
  fas,
  sudMvd,
  eis,
  bank,
];

export const MAIN_GROUP_IDS: AssessmentGroupId[] = ["fns", "efrsb", "kad", "fssp"];
export const OTHER_GROUP_IDS: AssessmentGroupId[] = [
  "rosfin",
  "minjust",
  "fas",
  "sud_mvd",
  "eis",
  "bank",
];

function toPositiveGroups(groups: AssessmentGroup[]): AssessmentGroup[] {
  return groups.map((g) => ({
    ...g,
    criteria: g.criteria.map((c) =>
      c.passed === false
        ? { ...c, passed: true as boolean | null, reason: OK_REASON }
        : { ...c },
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
