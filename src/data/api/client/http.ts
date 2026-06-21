// Минимальный HTTP-клиент поверх fetch. Используется только API-репозиториями.
// Компоненты и hooks не должны импортировать этот модуль.
import {
  createDataError,
  fromHttpStatus,
  normalizeUnknownError,
  type DataError,
} from "@/data/errors";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | null | undefined;

export interface HttpRequest {
  method?: HttpMethod;
  path: string;
  query?: Record<string, QueryValue | QueryValue[]>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export type AuthHeaderProvider = () => Record<string, string> | Promise<Record<string, string>>;

export interface HttpClientOptions {
  baseUrl: string;
  defaultTimeoutMs?: number;
  // Точка расширения для backend-команды: сюда позже подключаются токены / SSO.
  // TBD: интеграция с реальной авторизацией.
  getAuthHeaders?: AuthHeaderProvider;
}

export interface HttpClient {
  request<T>(req: HttpRequest): Promise<T>;
}

function buildUrl(baseUrl: string, path: string, query?: HttpRequest["query"]): string {
  const base = baseUrl.replace(/\/+$/, "");
  const rel = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base + rel, base || "http://placeholder.invalid");
  if (query) {
    for (const [key, raw] of Object.entries(query)) {
      const values = Array.isArray(raw) ? raw : [raw];
      for (const v of values) {
        if (v === undefined || v === null) continue;
        url.searchParams.append(key, String(v));
      }
    }
  }
  // Если baseUrl пустой — это ошибка конфигурации, должна быть отловлена выше.
  return base ? url.toString() : url.pathname + url.search;
}

async function readBody(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

export function createHttpClient(opts: HttpClientOptions): HttpClient {
  const { baseUrl, defaultTimeoutMs = 15000, getAuthHeaders } = opts;

  return {
    async request<T>(req: HttpRequest): Promise<T> {
      if (!baseUrl) {
        throw createDataError("API_NOT_CONFIGURED");
      }
      const method = req.method ?? "GET";
      const url = buildUrl(baseUrl, req.path, req.query);

      const ctl = new AbortController();
      const timeoutMs = req.timeoutMs ?? defaultTimeoutMs;
      const timer = setTimeout(() => ctl.abort(), timeoutMs);
      const onUserAbort = () => ctl.abort();
      req.signal?.addEventListener("abort", onUserAbort);

      const headers: Record<string, string> = {
        Accept: "application/json",
        ...(req.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...((await getAuthHeaders?.()) ?? {}),
        ...(req.headers ?? {}),
      };

      try {
        const res = await fetch(url, {
          method,
          headers,
          body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
          signal: ctl.signal,
        });

        const payload = await readBody(res);

        if (!res.ok) {
          throw fromHttpStatus(res.status, payload);
        }

        return payload as T;
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          if (req.signal?.aborted) throw normalizeUnknownError(e);
          throw createDataError("TIMEOUT");
        }
        if ((e as DataError).name === "DataError") throw e;
        // fetch network failure
        throw createDataError("NETWORK_ERROR", { message: (e as Error).message });
      } finally {
        clearTimeout(timer);
        req.signal?.removeEventListener("abort", onUserAbort);
      }
    },
  };
}
