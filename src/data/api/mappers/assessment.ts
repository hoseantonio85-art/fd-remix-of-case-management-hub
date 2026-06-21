import type {
  Assessment,
  AssessmentChange,
  AssessmentGroup,
  AssessmentGroupId,
  AssessmentSource,
} from "@/domain/assessment";
import type { AssessmentDto, AssessmentGroupDto, AssessmentChangeDto } from "../dto/assessment";

const toGroup = (g: AssessmentGroupDto): AssessmentGroup => ({
  ...g,
  id: g.id as AssessmentGroupId,
});

const toChange = (c: AssessmentChangeDto): AssessmentChange => ({
  text: c.text,
  tone: c.tone as AssessmentChange["tone"],
});

export function toAssessment(d: AssessmentDto): Assessment {
  return {
    inn: d.inn,
    counterpartyName: d.counterpartyName,
    date: d.date,
    nextCheck: d.nextCheck,
    source: d.source as AssessmentSource,
    summary: d.summary,
    changes: (d.changes ?? []).map(toChange),
    groups: (d.groups ?? []).map(toGroup),
  };
}
