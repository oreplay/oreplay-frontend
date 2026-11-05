import { Data, EventDetailModel } from "../../../../../../../shared/EntityTypes.ts"
import { EventAdminFormValues } from "../../../components/EventAdminForm/EventAdminForm.tsx"

/**
 * Applies the values of the event form to the cached event detail, so the page shows the edit
 * before the server answers. The cache holds the backend's `{ data }` envelope, so the fields are
 * changed inside `data`.
 * @param previous The cached event detail, or `undefined` when nothing is cached yet.
 * @param values The values the user saved in the event form.
 * @returns The event detail with the edit applied, or `undefined` when nothing was cached.
 */
export function withEditedEventDetail(
  previous: Data<EventDetailModel> | undefined,
  values: EventAdminFormValues,
): Data<EventDetailModel> | undefined {
  if (!previous) return previous
  return {
    ...previous,
    data: {
      ...previous.data,
      description: values.description,
      website: values.website as string,
      organizer: values.organizer,
      initial_date: values.startDate?.toSQLDate() ?? "",
      final_date: values.endDate?.toSQLDate() ?? "",
      scope: values.scope,
      is_hidden: !values.isPublic,
      timezone: values.timezone.id,
      country_code: values.countryCode,
    },
  }
}
