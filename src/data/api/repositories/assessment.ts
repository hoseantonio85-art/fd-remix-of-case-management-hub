import type { AssessmentRepository } from "@/data/repositories/types";
import type { HttpClient } from "../client/http";
import { endpoints, isTbdEndpoint } from "../config/endpoints";
import type { AssessmentDto, BuildAssessmentRequestDto } from "../dto/assessment";
import { toAssessment } from "../mappers/assessment";
import { createDataError, normalizeUnknownError } from "@/data/errors";

export function createApiAssessmentRepository(http: HttpClient): AssessmentRepository {
  return {
    async buildFor(name, inn, source = "auto", variant = "negative") {
      try {
        if (isTbdEndpoint(endpoints.assessments.build)) {
          throw createDataError("API_NOT_CONFIGURED", {
            message: "Endpoint оценки не согласован с backend (см. API_CONTRACT.md).",
          });
        }
        const body: BuildAssessmentRequestDto = {
          inn,
          counterpartyName: name,
          source,
          variant,
        };
        const data = await http.request<AssessmentDto>({
          method: "POST",
          path: endpoints.assessments.build,
          body,
        });
        return toAssessment(data);
      } catch (e) {
        throw normalizeUnknownError(e);
      }
    },
  };
}
