import { getToneForTag, toneStyles } from "./header-theme";
import { cn } from "@/lib/utils";

type Props = {
  tag: string;
  className?: string;
};

export function CounterpartyStatusBadge({ tag, className }: Props) {
  const tone = getToneForTag(tag);
  const styles = toneStyles[tone];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        styles.badge,
        className,
      )}
    >
      {tag}
    </span>
  );
}
