import {RunnerModel} from "../../../../../shared/EntityTypes.ts";

export function getUniqueStationNumbers(runners: RunnerModel[]): bigint[] {
  const stationNumbers = new Set<bigint>();

  runners.forEach(runner => {
    runner.runner_results[0].splits.forEach(split => {
      stationNumbers.add(split.control.station);
    });
  });

  // Convert the set to an array and sort in ascending order
  return Array.from(stationNumbers).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}