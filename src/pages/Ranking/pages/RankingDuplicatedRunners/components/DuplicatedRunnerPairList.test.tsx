import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DuplicatedRunner } from "../shared/duplicatedRunners.ts"
import DuplicatedRunnerPairList from "./DuplicatedRunnerPairList.tsx"

const mocks = vi.hoisted(() => ({
  runners: [] as DuplicatedRunner[],
  params: vi.fn(),
  request: vi.fn(),
}))

vi.mock("../../../../../infrastructure/repositories/results/results.ts", () => ({
  getGetListResultsQueryKey: () => ["results"],
  useGetListResults: (eventId: string, stageId: string, params: { output: string }) => {
    mocks.params(eventId, stageId, params)
    return { data: { data: mocks.runners }, isLoading: false, isError: false }
  },
}))

vi.mock("../../../../../infrastructure/orval/orval-axios-instance.ts", () => ({
  orvalAxiosInstance: mocks.request,
}))

vi.mock("../../../../../infrastructure/notifications/useNotifyError.ts", () => ({
  useNotifyError: () => vi.fn(),
}))

const REMOVE_BUTTON_NAME = "DuplicatedRunners.remove"

const makeRunner = (id: string, fullName: string, bibNumber: number): DuplicatedRunner => ({
  bib_number: bibNumber,
  class: "H-35",
  full_name: fullName,
  id,
  invalidate_link: `https://localhost/api/v1/events/evt-1/stages/stg-1/results?output=DuplicatedRunners&simplify=true&remove_from_ranking_runner_id=${id}`,
  partials_size: 2,
  points: 180,
})

const renderList = () =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={new QueryClient()}>
        <DuplicatedRunnerPairList eventId="evt-1" stageId="stg-1" />
      </QueryClientProvider>
    </MemoryRouter>,
  )

describe("DuplicatedRunnerPairList", () => {
  beforeEach(() => {
    mocks.runners = []
    mocks.params.mockReset()
    mocks.request.mockReset()
  })

  it("requests the duplicated runners output of the ranking stage", () => {
    renderList()
    expect(mocks.params).toHaveBeenCalledWith("evt-1", "stg-1", { output: "DuplicatedRunners" })
  })

  it("groups each duplicated pair under one shared heading", () => {
    mocks.runners = [
      makeRunner("a", "Ana López", 10),
      makeRunner("b", "Ana Lopez", 10),
      makeRunner("c", "Juan Pérez", 20),
      makeRunner("d", "Juan Perez", 21),
    ]
    renderList()
    const table = screen.getByRole("table")
    const [, ...pairGroups] = within(table).getAllByRole("rowgroup")
    expect(within(table).getAllByRole("columnheader")).toHaveLength(6)
    expect(pairGroups).toHaveLength(2)
    expect(within(pairGroups[0]).getByText("Ana López")).toBeInTheDocument()
    expect(within(pairGroups[0]).getByText("Ana Lopez")).toBeInTheDocument()
    expect(within(table).getAllByRole("button", { name: REMOVE_BUTTON_NAME })).toHaveLength(4)
    expect(within(pairGroups[0]).getAllByRole("link", { name: "H-35" })[0]).toHaveAttribute(
      "href",
      "/competitions/evt-1/stg-1?class=H-35",
    )
  })

  it("calls the runner's invalidate link after confirming the removal", async () => {
    mocks.runners = [makeRunner("a", "Ana López", 10), makeRunner("b", "Ana Lopez", 10)]
    mocks.request.mockResolvedValue({})
    renderList()
    fireEvent.click(screen.getAllByRole("button", { name: REMOVE_BUTTON_NAME })[1])
    expect(mocks.request).not.toHaveBeenCalled()

    const dialog = screen.getByRole("dialog")
    fireEvent.click(within(dialog).getByRole("button", { name: REMOVE_BUTTON_NAME }))

    await waitFor(() =>
      expect(mocks.request).toHaveBeenCalledWith({
        url: "/api/v1/events/evt-1/stages/stg-1/results?output=DuplicatedRunners&simplify=true&remove_from_ranking_runner_id=b",
        method: "GET",
      }),
    )
  })

  it("shows the empty message when there are no duplicates", () => {
    renderList()
    expect(screen.getByText("DuplicatedRunners.empty")).toBeInTheDocument()
  })
})
