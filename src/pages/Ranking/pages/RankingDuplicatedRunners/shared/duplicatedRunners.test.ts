import { describe, expect, it } from "vitest"
import { ArrayParticipant } from "../../../../../domain/types/v1api"
import {
  DUPLICATED_RUNNER_COLUMNS,
  DuplicatedRunner,
  duplicatedRunnerCellTone,
  isNumericColumn,
  isRepeatedInPair,
  pairDuplicatedRunners,
  readDuplicatedRunners,
  removalRequestPath,
} from "./duplicatedRunners.ts"

const makeRunner = (id: string): DuplicatedRunner => ({
  bib_number: 4999,
  class: "H-35",
  full_name: `Runner ${id}`,
  id,
  invalidate_link: `https://example.com/remove/${id}`,
  partials_size: 3,
  points: 250,
})

describe("pairDuplicatedRunners", () => {
  it("groups consecutive runners into duplicate pairs", () => {
    const runners = ["a", "b", "c", "d"].map(makeRunner)
    expect(pairDuplicatedRunners(runners).map((pair) => pair.map(({ id }) => id))).toEqual([
      ["a", "b"],
      ["c", "d"],
    ])
  })

  it("returns no pairs when there are no duplicates", () => {
    expect(pairDuplicatedRunners([])).toEqual([])
  })
})

describe("readDuplicatedRunners", () => {
  it("reads the duplicated runners from the results response", () => {
    const runners = [makeRunner("a"), makeRunner("b")]
    const response = { data: runners } as unknown as ArrayParticipant
    expect(readDuplicatedRunners(response)).toEqual(runners)
  })

  it("returns an empty list before the response arrives", () => {
    expect(readDuplicatedRunners(undefined)).toEqual([])
  })
})

describe("isRepeatedInPair", () => {
  const pair = [makeRunner("a"), { ...makeRunner("b"), bib_number: "4999", points: 120 }]

  it("marks the second runner's values that equal the first runner's", () => {
    const repeated = DUPLICATED_RUNNER_COLUMNS.filter((column) => isRepeatedInPair(pair, 1, column))
    expect(repeated).toEqual(["bib_number", "class", "partials_size"])
  })

  it("never marks the first runner of the pair", () => {
    expect(DUPLICATED_RUNNER_COLUMNS.some((column) => isRepeatedInPair(pair, 0, column))).toBe(
      false,
    )
  })
})

describe("isNumericColumn", () => {
  it("treats partials and points as numeric", () => {
    expect(DUPLICATED_RUNNER_COLUMNS.filter(isNumericColumn)).toEqual(["partials_size", "points"])
  })
})

describe("removalRequestPath", () => {
  it("keeps the path and query of the invalidate link", () => {
    expect(
      removalRequestPath(
        "https://localhost/api/v1/events/e1/stages/s1/results?output=DuplicatedRunners&simplify=true&remove_from_ranking_runner_id=r1",
      ),
    ).toBe(
      "/api/v1/events/e1/stages/s1/results?output=DuplicatedRunners&simplify=true&remove_from_ranking_runner_id=r1",
    )
  })
})

describe("duplicatedRunnerCellTone", () => {
  const pairWithPartials = (first: number, second: number) => [
    { ...makeRunner("a"), partials_size: first },
    { ...makeRunner("b"), partials_size: second },
  ]
  const partialsTones = (first: number, second: number) =>
    [0, 1].map((rowIndex) =>
      duplicatedRunnerCellTone(pairWithPartials(first, second), rowIndex, "partials_size"),
    )

  it("mutes a single partial and keeps the other runner's partials normal", () => {
    expect(partialsTones(1, 4)).toEqual(["muted", "normal"])
    expect(partialsTones(4, 1)).toEqual(["normal", "muted"])
  })

  it("mutes both runners when each has a single partial", () => {
    expect(partialsTones(1, 1)).toEqual(["muted", "muted"])
  })

  it("warns on both runners when neither has a single partial", () => {
    expect(partialsTones(3, 4)).toEqual(["warning", "warning"])
  })

  it("mutes the other columns only on the second runner when repeated", () => {
    const pair = [makeRunner("a"), { ...makeRunner("b"), full_name: "Other" }]
    expect(duplicatedRunnerCellTone(pair, 1, "class")).toBe("muted")
    expect(duplicatedRunnerCellTone(pair, 1, "full_name")).toBe("normal")
    expect(duplicatedRunnerCellTone(pair, 0, "class")).toBe("normal")
  })
})
