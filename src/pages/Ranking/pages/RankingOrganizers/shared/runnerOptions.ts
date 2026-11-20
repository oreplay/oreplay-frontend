import { RunnerSearch } from "../../../../../domain/types/v1api"
import { AutocompleteOption } from "../../../components/form/AutocompleteTextField.tsx"
import { formatOrganizerName } from "./formatOrganizerName.ts"

export function toRunnerOptions(runners: RunnerSearch[]): AutocompleteOption[] {
  return runners.map((runner) => ({
    id: runner.id,
    label: formatOrganizerName(runner.first_name, runner.last_name),
    detail: runner.class?.short_name,
  }))
}
