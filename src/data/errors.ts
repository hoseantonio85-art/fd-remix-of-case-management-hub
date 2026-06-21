// Нормализованная ошибка data-слоя.
// UI и hooks не должны видеть HTTP-детали; toast/error UI берут message отсюда.

export type DataErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "SERVER_ERROR"
  | "API_NOT_CONFIGURED"
  | "UNKNOWN";

export interface DataError extends Error {
  name: "DataError";
  code: DataErrorCode;
  status?: number;
  details?: unknown;
  retryable: boolean;
}

const DEFAULT_MESSAGES: Record<DataErrorCode, string> = {
  NETWORK_ERROR: "Не удалось связаться с сервером. Проверьте подключение.",
  TIMEOUT: "Превышено время ожидания ответа сервера.",
  UNAUTHORIZED: "Требуется авторизация.",
  FORBIDDEN: "Недостаточно прав для выполнения операции.",
  NOT_FOUND: "Запрашиваемые данные не найдены.",
  VALIDATION_ERROR: "Сервер отклонил данные: проверьте поля.",
  CONFLICT: "Конфликт данных. Обновите и повторите.",
  SERVER_ERROR: "Внутренняя ошибка сервера. Попробуйте позже.",
  API_NOT_CONFIGURED: "API не настроен. Задайте VITE_API_BASE_URL.",
  UNKNOWN: "Неизвестная ошибка.",
};

const RETRYABLE: ReadonlySet<DataErrorCode> = new Set<DataErrorCode>([
  "NETWORK_ERROR",
  "TIMEOUT",
  "SERVER_ERROR",
]);

export function createDataError(
  code: DataErrorCode,
  init?: { message?: string; status?: number; details?: unknown },
): DataError {
  const message = init?.message?.trim() || DEFAULT_MESSAGES[code];
  const err = new Error(message) as DataError;
  err.name = "DataError";
  err.code = code;
  err.status = init?.status;
  err.details = init?.details;
  err.retryable = RETRYABLE.has(code);
  return err;
}

export function isDataError(e: unknown): e is DataError {
  return !!e && typeof e === "object" && (e as { name?: string }).name === "DataError";
}

export function fromHttpStatus(status: number, details?: unknown): DataError {
  if (status === 401) return createDataError("UNAUTHORIZED", { status, details });
  if (status === 403) return createDataError("FORBIDDEN", { status, details });
  if (status === 404) return createDataError("NOT_FOUND", { status, details });
  if (status === 409) return createDataError("CONFLICT", { status, details });
  if (status === 422 || status === 400) return createDataError("VALIDATION_ERROR", { status, details });
  if (status >= 500) return createDataError("SERVER_ERROR", { status, details });
  return createDataError("UNKNOWN", { status, details });
}

export function normalizeUnknownError(e: unknown): DataError {
  if (isDataError(e)) return e;
  if (e instanceof Error) {
    if (e.name === "AbortError") return createDataError("TIMEOUT");
    return createDataError("UNKNOWN", { message: e.message });
  }
  return createDataError("UNKNOWN");
}
