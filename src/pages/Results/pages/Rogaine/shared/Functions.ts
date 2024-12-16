import {ProcessedRunnerModel} from "../../../components/VirtualTicket/shared/EntityTypes.ts";

export function getUniqueStationNumbers(runners: ProcessedRunnerModel[]): bigint[] {
  const stationNumbers = new Set<bigint>();

  runners.forEach(runner => {
    runner.runner_results[0].splits.forEach(split => {
      if (split.control) {
        stationNumbers.add(BigInt(split.control.station));
      }
    });
  });

  // Convert the set to an array and sort in ascending order
  return Array.from(stationNumbers).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}