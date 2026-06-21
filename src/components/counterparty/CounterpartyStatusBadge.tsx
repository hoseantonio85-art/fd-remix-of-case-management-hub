import { StatusBadge, type StatusTone, type StatusBadgeSize } from "@/shared/ui";

/**
 * Семантика статусов задаётся явным mapping, а не подстрокой.
 * Это исключает ситуации, когда нейтральное "Подтверждена" окрашивается как риск.
 */
const statusToneByLabel: Record<string, StatusTone> = {
  "Нет риска": "success",
  "Риск дефолта": "warning",
  Просрочено: "danger",
  "Просрочено с риском дефолта": "danger",
  "На оценке": "violet",
  "Статус изменён": "info",
  Подтверждена: "success",
  Подтверждён: "success",
  "Риск подтверждён": "danger",
  "Риск снят": "success",
  Снят: "success",
};

function tagToTone(tag: string): StatusTone {
  const exact = statusToneByLabel[tag.trim()];
  if (exact) return exact;
  const t = tag.toLowerCase();
  if (t.includes("просрочено с риском")) return "danger";
  if (t.includes("риск дефолта")) return "warning";
  if (t.includes("просроч")) return "danger";
  if (t.includes("нет риска")) return "success";
  if (t.includes("на оценке")) return "violet";
  if (t.includes("снят")) return "success";
  return "neutral";
}

type Props = {
  tag: string;
  size?: StatusBadgeSize;
  className?: string;
};

export function CounterpartyStatusBadge({ tag, size = "compact", className }: Props) {
  return (
    <StatusBadge tone={tagToTone(tag)} size={size} className={className}>
      {tag}
    </StatusBadge>
  );
}
