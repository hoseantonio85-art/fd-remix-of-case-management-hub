export type RiskStatus = "pending" | "confirmed" | "dismissed";

export interface RiskSignal {
  id: string;
  type: string;
  source: string;
  detectedAt: string;
  description: string;
  status: RiskStatus;
  availableMeasures: string[];
  decision?: {
    date: string;
    measures: string[];
    comment: string;
  };
  dismissal?: {
    date: string;
    comment: string;
  };
}

export interface Contract {
  id: string;
  number: string;
  debt: number;
  overdue: number;
  overdueDays: number;
  measures: string;
  collectionStage?: string;
}

export interface CollectionSubStep {
  id: string;
  title: string;
  stage: string;
  status: "done" | "current" | "upcoming";
  startDate?: string;
  sla?: string;
  plannedDate?: string;
  overdue?: boolean;
}

export interface Counterparty {
  id: string;
  name: string;
  inn: string;
  tag: string;
  totalDebt: string;
  overdueDebt: string;
  contracts: Contract[];
  risks: RiskSignal[];
  collection: CollectionSubStep[];
}

const measuresFinancial = [
  "Блокировка поставок",
  "Реструктуризация долга",
  "Запрос обеспечения",
  "Уступка прав требования",
  "Ускоренное взыскание",
  "Контроль движения средств",
];
const measuresCriminal = [
  "Приостановка отгрузок",
  "Юридическая проверка",
  "Запрос обеспечения",
  "Эскалация в СБ",
];
const measuresAdmin = [
  "Письменное уведомление",
  "Корректировка лимита",
  "Контроль платежей",
];
const measuresBankruptcy = [
  "Включение в реестр кредиторов",
  "Подача иска",
  "Заморозка отгрузок",
  "Уступка прав требования",
];

export const counterparties: Counterparty[] = [
  {
    id: "omega",
    name: "ООО «ОмегаСервис»",
    inn: "77467927493",
    tag: "Просрочено с риском дефолта",
    totalDebt: "1,5 млн. ₽",
    overdueDebt: "0,2 млн. ₽",
    contracts: [
      {
        id: "c1",
        number: "№ 08-Г/2023",
        debt: 0.5,
        overdue: 0.2,
        overdueDays: 20,
        measures: "Подписан акт сверки взаиморасчетов",
        collectionStage: "Досудебное урегулирование",
      },
      { id: "c2", number: "№ 09-Г/2023", debt: 0.7, overdue: 0, overdueDays: 0, measures: "—" },
      { id: "c3", number: "№ 10-Г/2023", debt: 0.3, overdue: 0, overdueDays: 0, measures: "—" },
    ],
    risks: [
      {
        id: "r1",
        type: "Ухудшилось финансовое состояние",
        source: "ФНС",
        detectedAt: "01.06.2026",
        description: "Имеются действующие решения ФНС о приостановлении операций по счетам",
        status: "pending",
        availableMeasures: measuresFinancial,
      },
      {
        id: "r2",
        type: "Уголовное дело",
        source: "СПАРК / Картотека дел",
        detectedAt: "29.05.2026",
        description: "Возбуждено уголовное дело в отношении генерального директора",
        status: "pending",
        availableMeasures: measuresCriminal,
      },
      {
        id: "r3",
        type: "Административные нарушения",
        source: "ФССП",
        detectedAt: "24.05.2026",
        description: "Зафиксировано 3 новых исполнительных производства за последние 30 дней",
        status: "pending",
        availableMeasures: measuresAdmin,
      },
      {
        id: "r4",
        type: "Банкротство",
        source: "ЕФРСБ",
        detectedAt: "20.05.2026",
        description: "Опубликовано сообщение о намерении кредитора обратиться с заявлением о банкротстве",
        status: "pending",
        availableMeasures: measuresBankruptcy,
      },
    ],
    collection: [
      { id: "s1", title: "Коммуникация с должником", stage: "Досудебное урегулирование", status: "done" },
      {
        id: "s2",
        title: "Сверка взаиморасчетов",
        stage: "Досудебное урегулирование",
        status: "current",
        startDate: "28.05.2026",
        sla: "10 дней",
        plannedDate: "07.06.2026",
        overdue: false,
      },
      { id: "s3", title: "Достигнуты договоренности", stage: "Досудебное урегулирование", status: "upcoming" },
      { id: "s4", title: "Подготовка к суду", stage: "Судебная работа", status: "upcoming" },
      { id: "s5", title: "Судебная работа", stage: "Судебная работа", status: "upcoming" },
      { id: "s6", title: "Получен судебный акт", stage: "Судебная работа", status: "upcoming" },
      { id: "s7", title: "Исполнительное производство", stage: "Принудительное взыскание", status: "upcoming" },
      { id: "s8", title: "Банкротство", stage: "Принудительное взыскание", status: "upcoming" },
      { id: "s9", title: "Погашено", stage: "Завершение работы", status: "upcoming" },
    ],
  },
  {
    id: "gamma",
    name: "ООО «Гамма Плюс»",
    inn: "77467927493",
    tag: "Просрочено с риском дефолта",
    totalDebt: "1,2 млн. ₽",
    overdueDebt: "0,1 млн. ₽",
    contracts: [
      { id: "g1", number: "№ 11-Г/2024", debt: 0.6, overdue: 0.1, overdueDays: 12, measures: "Направлена претензия" },
      { id: "g2", number: "№ 12-Г/2024", debt: 0.4, overdue: 0, overdueDays: 0, measures: "—" },
      { id: "g3", number: "№ 13-Г/2024", debt: 0.2, overdue: 0, overdueDays: 0, measures: "—" },
    ],
    risks: [
      {
        id: "gr1",
        type: "Административные нарушения",
        source: "ФССП",
        detectedAt: "30.05.2026",
        description: "Новые исполнительные производства по налоговой задолженности",
        status: "pending",
        availableMeasures: measuresAdmin,
      },
    ],
    collection: [
      { id: "s1", title: "Коммуникация с должником", stage: "Досудебное урегулирование", status: "current",
        startDate: "20.05.2026", sla: "7 дней", plannedDate: "27.05.2026", overdue: true },
      { id: "s2", title: "Сверка взаиморасчетов", stage: "Досудебное урегулирование", status: "upcoming" },
      { id: "s3", title: "Достигнуты договоренности", stage: "Досудебное урегулирование", status: "upcoming" },
      { id: "s4", title: "Подготовка к суду", stage: "Судебная работа", status: "upcoming" },
      { id: "s5", title: "Судебная работа", stage: "Судебная работа", status: "upcoming" },
      { id: "s6", title: "Получен судебный акт", stage: "Судебная работа", status: "upcoming" },
      { id: "s7", title: "Исполнительное производство", stage: "Принудительное взыскание", status: "upcoming" },
      { id: "s8", title: "Банкротство", stage: "Принудительное взыскание", status: "upcoming" },
      { id: "s9", title: "Погашено", stage: "Завершение работы", status: "upcoming" },
    ],
  },
];
