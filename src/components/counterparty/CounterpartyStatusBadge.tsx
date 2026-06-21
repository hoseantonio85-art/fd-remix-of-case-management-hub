import { StatusBadge, type StatusTone, type StatusBadgeSize } from "@/shared/ui";

function tagToTone(tag: string): StatusTone {
  const t = tag.toLowerCase();
  if (t.includes("просрочено с риском") || (t.includes("дефолт") && t.includes("просроч")))
    return "danger";
  if (t.includes("риск дефолта")) return "warning";
  if (t.includes("просроч")) return "danger";
  if (t.includes("нет риска")) return "success";
  if (t.includes("снят")) return "success";
  if (t.includes("на оценке")) return "violet";
  if (t.includes("подтвержд")) return "danger";
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
