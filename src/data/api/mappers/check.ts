import type { CheckRecordDto, CheckType } from "@/data/repositories/types";
import type { CheckRecordApiDto } from "../dto/check";

export function toCheckRecord(d: CheckRecordApiDto): CheckRecordDto {
  return {
    id: d.id,
    inn: d.inn || undefined,
    fileNames: [...(d.fileNames ?? [])],
    status: (d.status === "done" ? "done" : "running") as CheckRecordDto["status"],
    createdAt: d.createdAt,
    type: d.type as CheckType,
  };
}
