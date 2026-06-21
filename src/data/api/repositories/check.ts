import type { CheckRecordDto, CheckRepository } from "@/data/repositories/types";
import type { HttpClient } from "../client/http";
import { endpoints, isTbdEndpoint } from "../config/endpoints";
import type { CheckRecordApiDto, RunCheckRequestDto } from "../dto/check";
import { toCheckRecord } from "../mappers/check";
import { createDataError, normalizeUnknownError } from "@/data/errors";

// Транспорт обновлений (polling / SSE / WS) TBD — UI его не знает.
// До согласования: subscribe = noop, useChecks использует list().
export function createApiCheckRepository(http: HttpClient): CheckRepository {
  const ensure = (e: string): string => {
    if (isTbdEndpoint(e)) {
      throw createDataError("API_NOT_CONFIGURED", {
        message: "Endpoint проверок не согласован с backend (см. API_CONTRACT.md).",
      });
    }
    return e;
  };

  return {
    async list(): Promise<CheckRecordDto[]> {
      try {
        const path = ensure(endpoints.checks.list);
        const data = await http.request<CheckRecordApiDto[]>({ method: "GET", path });
        return (data ?? []).map(toCheckRecord);
      } catch (e) {
        throw normalizeUnknownError(e);
      }
    },
    async run(input) {
      try {
        const path = ensure(endpoints.checks.run);
        const body: RunCheckRequestDto = {
          inn: input.inn,
          fileNames: input.fileNames,
          type: input.type,
        };
        const data = await http.request<CheckRecordApiDto>({ method: "POST", path, body });
        return toCheckRecord(data);
      } catch (e) {
        throw normalizeUnknownError(e);
      }
    },
    async remove(id) {
      try {
        const path = ensure(endpoints.checks.remove(id));
        await http.request<void>({ method: "DELETE", path });
      } catch (e) {
        throw normalizeUnknownError(e);
      }
    },
    subscribe(_listener) {
      // TBD: transport для running → done будет выбран backend-командой.
      // Сейчас UI вызывает list() при первом монтировании; обновления статусов
      // потребуют либо polling, либо SSE/WS (см. API_CONTRACT.md).
      return () => {};
    },
  };
}
