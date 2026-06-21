// Единая точка чтения env: какой источник данных используется.
// UI и hooks не должны читать import.meta.env напрямую.

export type DataSource = "mock" | "api";

export interface DataSourceConfig {
  source: DataSource;
  apiBaseUrl: string; // пустая строка, если не задан
  requestTimeoutMs: number;
  mockLatencyMs: number;
  mockCheckDurationMs: number;
}

function readSource(): DataSource {
  const raw = (import.meta.env.VITE_DATA_SOURCE as string | undefined)?.trim().toLowerCase();
  return raw === "api" ? "api" : "mock";
}

export const dataConfig: DataSourceConfig = {
  source: readSource(),
  apiBaseUrl: ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "").trim(),
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
  mockLatencyMs: Number(import.meta.env.VITE_MOCK_LATENCY_MS ?? 250),
  mockCheckDurationMs: Number(import.meta.env.VITE_MOCK_CHECK_DURATION_MS ?? 5000),
};

export const isApiConfigured = (cfg: DataSourceConfig = dataConfig): boolean =>
  cfg.source === "api" && cfg.apiBaseUrl.length > 0;
