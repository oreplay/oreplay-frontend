import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProcessResultsDialog from "./ProcessResultsDialog.tsx"

const mocks = vi.hoisted(() => ({
  includedClassNames: [] as string[],
  eventClassNames: [] as string[],
  participants: [] as { full_name: string; stage?: { status_code: number } }[],
  calculate: vi.fn(),
}))

vi.mock("../../../../../../infrastructure/repositories/results/results.ts", () => ({
  useGetListResults: () => ({ data: { data: mocks.participants }, isLoading: false }),
}))

vi.mock(
  "../../../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts",
  () => ({
    useGetRankingSettings: () => ({
      data: { data: { included_class_names: mocks.includedClassNames } },
      isLoading: false,
    }),
  }),
)

vi.mock("../../../../../../infrastructure/repositories/stage-classes/stage-classes.ts", () => ({
  useGetListStageClasses: () => ({
    data: {
      data: mocks.eventClassNames.map((short_name) => ({
        id: short_name,
        short_name,
        long_name: short_name,
      })),
    },
    isLoading: false,
  }),
}))

vi.mock("../../../../shared/calculateRankingBatches.ts", () => ({
  calculateRankingBatches: mocks.calculate,
}))

vi.mock("@toolpad/core/useNotifications", () => ({
  useNotifications: () => ({ show: vi.fn() }),
}))

vi.mock("../../../../../../infrastructure/notifications/useNotifyError.ts", () => ({
  useNotifyError: () => vi.fn(),
}))

const CONFIRM_LABEL = "common:confirm"

const renderDialog = () =>
  render(
    <ProcessResultsDialog
      open
      rankingId="rk-1"
      eventId="evt-1"
      stageId="stg-1"
      onClose={vi.fn()}
    />,
  )

describe("ProcessResultsDialog", () => {
  beforeEach(() => {
    mocks.calculate.mockReset()
    mocks.participants = []
  })

  it("confirms right away when the ranking and the event hold the same classes", () => {
    mocks.includedClassNames = ["M-21"]
    mocks.eventClassNames = ["M-21"]
    renderDialog()
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: CONFIRM_LABEL }))
    expect(mocks.calculate).toHaveBeenCalled()
  })

  it("waits for the runners in race to be acknowledged before confirming", () => {
    mocks.includedClassNames = ["M-21"]
    mocks.eventClassNames = ["M-21"]
    mocks.participants = [{ full_name: "Ana Rey", stage: { status_code: 0 } }]
    renderDialog()
    expect(screen.getByRole("button", { name: CONFIRM_LABEL })).toBeDisabled()
    fireEvent.click(screen.getByRole("checkbox"))
    fireEvent.click(screen.getByRole("button", { name: CONFIRM_LABEL }))
    expect(mocks.calculate).toHaveBeenCalled()
  })

  it("waits for every class warning to be acknowledged before confirming", () => {
    mocks.includedClassNames = ["M-21", "M-E"]
    mocks.eventClassNames = ["M-21", "W-21"]
    renderDialog()
    const [missingInEvent, notInDefinition] = screen.getAllByRole("checkbox")
    expect(screen.getByRole("button", { name: CONFIRM_LABEL })).toBeDisabled()

    fireEvent.click(missingInEvent)
    expect(screen.getByRole("button", { name: CONFIRM_LABEL })).toBeDisabled()

    fireEvent.click(notInDefinition)
    fireEvent.click(screen.getByRole("button", { name: CONFIRM_LABEL }))
    expect(mocks.calculate).toHaveBeenCalledWith("rk-1", "evt-1", "stg-1", expect.any(Function))
  })
})
