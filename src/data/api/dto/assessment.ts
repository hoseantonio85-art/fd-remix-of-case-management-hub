// DTO оценки. UI не импортирует напрямую.

export interface AssessmentCriterionDto {
  number: number;
  title: string;
  passed: boolean | null;
  reason: string;
  source?: string;
}

export interface AssessmentGroupDto {
  id: string;
  title: string;
  description: string;
  criteria: AssessmentCriterionDto[];
}

export interface AssessmentChangeDto {
  text: string;
  tone: string;
}

export interface AssessmentDto {
  inn: string;
  counterpartyName: string;
  date: string;
  nextCheck?: string;
  source: string;
  summary: string;
  changes: AssessmentChangeDto[];
  groups: AssessmentGroupDto[];
}

export interface BuildAssessmentRequestDto {
  inn: string;
  counterpartyName: string;
  source: string;
  variant?: string;
}
