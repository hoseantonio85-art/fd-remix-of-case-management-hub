// DTO проверок. UI не импортирует напрямую.

export interface CheckRecordApiDto {
  id: string;
  inn?: string;
  fileNames: string[];
  status: string; // running | done
  createdAt: number;
  type: string; // counterparty | contract | complex
}

export interface RunCheckRequestDto {
  inn?: string;
  fileNames: string[];
  type: string;
}
