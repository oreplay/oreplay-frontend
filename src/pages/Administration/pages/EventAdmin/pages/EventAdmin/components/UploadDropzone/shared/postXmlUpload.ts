import { orvalAxiosInstance } from "../../../../../../../../../infrastructure/orval/orval-axios-instance.ts"
import { ResUploadedV2 } from "../../../../../../../../../domain/types/v1api"

export const XML_CONTENT_TYPE = "application/xml"

export function postXmlUpload(
  eventId: string,
  stageId: string,
  file: File,
): Promise<ResUploadedV2> {
  return orvalAxiosInstance<ResUploadedV2>({
    url: `/api/v1/events/${eventId}/uploads/v2/`,
    method: "POST",
    headers: { "Content-Type": XML_CONTENT_TYPE },
    params: { stage_id: stageId },
    data: file,
  })
}
