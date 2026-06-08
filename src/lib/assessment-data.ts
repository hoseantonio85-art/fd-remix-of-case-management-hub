export type AssessmentTagCategory = "attention" | "info" | "clear";

export type AssessmentTagColor = "red" | "orange" | "green" | "blue" | "gray";

export type AssessmentTag =
  | "Критичный риск"
  | "Менее 6 месяцев"
  | "Выявлен долг"
  | "91% (Повышен)"
  | "Не найдено"
  | "Соответствует"
  | "Не найдены"
  | "Без изменений"
  | "Ограничений нет"
  | "Не найден"
  | "Риски отсутствуют"
  | "Не обнаружено"
  | "Совпадение (Инфо)"
  | "Негатива: 0"
  | "Негатива: 2";

export const tagMeta: Record<
  AssessmentTag,
  { color: AssessmentTagColor; category: AssessmentTagCategory }
> = {
  "Критичный риск": { color: "red", category: "attention" },
  "Менее 6 месяцев": { color: "orange", category: "attention" },
  "Выявлен долг": { color: "orange", category: "attention" },
  "91% (Повышен)": { color: "orange", category: "attention" },
  "Негатива: 2": { color: "gray", category: "attention" },
  "Совпадение (Инфо)": { color: "blue", category: "info" },
  "Негатива: 0": { color: "gray", category: "clear" },
  "Не найдено": { color: "green", category: "clear" },
  "Соответствует": { color: "green", category: "clear" },
  "Не найдены": { color: "green", category: "clear" },
  "Без изменений": { color: "green", category: "clear" },
  "Ограничений нет": { color: "green", category: "clear" },
  "Не найден": { color: "green", category: "clear" },
  "Риски отсутствуют": { color: "green", category: "clear" },
  "Не обнаружено": { color: "green", category: "clear" },
};

export const tagColorClass: Record<AssessmentTagColor, string> = {
  red: "bg-red-50 text-red-600",
  orange: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-sky-50 text-sky-600",
  gray: "bg-slate-100 text-slate-500",
};

export type AssessmentCriterion = {
  number: number;
  title: string;
  tag: AssessmentTag;
  comment?: string;
  source?: string;
};

export type AssessmentGroupId = "legal" | "management" | "finance" | "court";

export type AssessmentGroup = {
  id: AssessmentGroupId;
  title: string;
  description: string;
  total: number;
  criteria: AssessmentCriterion[];
  tone: "rose" | "amber" | "slate" | "emerald";
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

const legal: AssessmentGroup = {
  id: "legal",
  title: "Юридический статус и правоспособность",
  description: "Проверка статуса ЮЛ, регистрации, ограничений и права заключать договор",
  tone: "rose",
  total: 10,
  criteria: [
    { number: 1, title: "ЮЛ ликвидировано / в процессе ликвидации / реорганизации путём присоединения", tag: "Критичный риск", source: "ЕГРЮЛ" },
    { number: 2, title: "ЮЛ в процедуре банкротства / банкрот / подавало заявление", tag: "Не найдено" },
    { number: 3, title: "Деятельность приостановлена по КоАП РФ", tag: "Не найдено" },
    { number: 4, title: "Решение о приостановлении деятельности или оспаривание", tag: "Не найдено" },
    { number: 5, title: "Ограничения по счетам от ФНС", tag: "Ограничений нет", source: "ФНС" },
    { number: 6, title: "Недостоверный адрес в ЕГРЮЛ", tag: "Соответствует", source: "ЕГРЮЛ" },
    { number: 7, title: "Адрес массовой регистрации, кроме БЦ", tag: "Не найден" },
    { number: 8, title: "Смена юрадреса в течение года", tag: "Без изменений" },
    { number: 9, title: "С даты регистрации <6 месяцев", tag: "Менее 6 месяцев" },
    { number: 10, title: "Отсутствие нужных ОКВЭД под договор / ТЗ", tag: "Соответствует" },
  ],
};

const management: AssessmentGroup = {
  id: "management",
  title: "Руководство и бенефициары",
  description: "Проверка руководителей, учредителей, связей и изменений в управлении",
  tone: "amber",
  total: 11,
  criteria: [
    { number: 1, title: "ФИО руководителей в реестре дисквалифицированных лиц", tag: "Не найдены" },
    { number: 2, title: "Недостоверные сведения о руководителе или учредителе по ФНС", tag: "Соответствует", source: "ФНС" },
    { number: 3, title: "Банкротство физлица, руководителя или учредителя, за 12 месяцев", tag: "Не найдено" },
    { number: 4, title: "Судимость руководителя или учредителя за экономические преступления", tag: "Не обнаружено" },
    { number: 5, title: "Среди учредителей / руководителей найдены иностранные лица", tag: "Совпадение (Инфо)" },
    { number: 6, title: "Одно лицо = учредитель и руководитель", tag: "Совпадение (Инфо)" },
    { number: 7, title: ">10 ЮЛ с тем же руководителем", tag: "Негатива: 0" },
    { number: 8, title: ">10 ЮЛ с тем же учредителем-физлицом", tag: "Негатива: 0" },
    { number: 9, title: "Смена руководителя в течение года", tag: "Без изменений" },
    { number: 10, title: "Смена управляющей компании в течение года", tag: "Без изменений" },
    { number: 11, title: "Отсутствие маркеров из I–III групп", tag: "Риски отсутствуют" },
  ],
};

const finance: AssessmentGroup = {
  id: "finance",
  title: "Финансы и налоги",
  description: "Проверка налоговой дисциплины, долгов, выручки и финансовой устойчивости",
  tone: "slate",
  total: 10,
  criteria: [
    { number: 1, title: "Не сдаёт налоговую отчётность >1 года", tag: "Не найдено" },
    { number: 2, title: "Неоплаченная налоговая задолженность", tag: "Выявлен долг", source: "ФНС" },
    { number: 3, title: "Доля вычитаемого НДС >89%", tag: "91% (Повышен)" },
    { number: 4, title: "Обязательства >30% выручки", tag: "Соответствует" },
    { number: 5, title: "Снижение выручки >50%", tag: "Не обнаружено" },
    { number: 6, title: "Численность недостаточна для договора", tag: "Соответствует" },
    { number: 7, title: "Уставной капитал ≤50 тыс. руб.", tag: "Соответствует" },
    { number: 8, title: "С даты регистрации прошло 12 месяцев", tag: "Соответствует" },
    { number: 9, title: "Положительный опыт с компаниями холдинга", tag: "Соответствует" },
    { number: 10, title: "Госконтракты за 12 месяцев при выручке >100 млн руб.", tag: "Соответствует" },
  ],
};

const court: AssessmentGroup = {
  id: "court",
  title: "Судебная нагрузка и репутация",
  description: "Проверка судебных, исполнительных и репутационных факторов",
  tone: "emerald",
  total: 12,
  criteria: [
    { number: 1, title: "Списки терроризма / экстремизма", tag: "Не найден" },
    { number: 2, title: "Список иноагентов", tag: "Не найден" },
    { number: 3, title: "Ст. 19.28 КоАП — незаконное вознаграждение", tag: "Не обнаружено" },
    { number: 4, title: "Реестр недобросовестных поставщиков", tag: "Не найдено", source: "ФАС" },
    { number: 5, title: "Исполнительные производства >10% выручки", tag: "Негатива: 2" },
    { number: 6, title: "Сумма арбитражных дел ответчиком значительная", tag: "Негатива: 2" },
    { number: 7, title: "Требования к ответчику >10% выручки", tag: "Соответствует" },
    { number: 8, title: "Налоговый спор в суде, ответчик", tag: "Не найдено" },
    { number: 9, title: "Банкротство физлица-ИП за 12 месяцев", tag: "Не найдено" },
    { number: 10, title: "Претензии / санкции от госорганов", tag: "Не обнаружено" },
    { number: 11, title: "Иная негативная репутационная информация", tag: "Не обнаружено" },
    { number: 12, title: "3+ фактора из III группы", tag: "Не обнаружено" },
  ],
};

export const defaultGroups: AssessmentGroup[] = [legal, management, finance, court];

export function buildAssessment(
  counterpartyName: string,
  inn: string,
  source: AssessmentSource = "auto",
  dateOverride?: string,
): Assessment {
  return {
    inn,
    counterpartyName,
    date: dateOverride ?? "04.06.2026",
    nextCheck: source === "auto" ? "завтра" : undefined,
    source,
    summary:
      "По результатам оценки выявлены критические факторы по юридическому статусу, повышенная доля вычитаемого НДС и налоговая задолженность. Также есть информационные совпадения по учредителям и активность в исполнительных производствах.",
    changes: [
      { text: "Появились ограничения ФНС по банковским счетам", tone: "rose" },
      { text: "Обнаружен новый налоговый спор", tone: "amber" },
      { text: "Изменился юридический адрес", tone: "slate" },
      { text: "Добавлены сведения о смене руководителя", tone: "slate" },
    ],
    groups: defaultGroups,
  };
}

export function groupCounts(g: AssessmentGroup) {
  let attention = 0;
  let info = 0;
  let clear = 0;
  for (const c of g.criteria) {
    const cat = tagMeta[c.tag].category;
    if (cat === "attention") attention++;
    else if (cat === "info") info++;
    else clear++;
  }
  return { attention, info, clear };
}

export const toneStyles: Record<
  AssessmentGroup["tone"],
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
