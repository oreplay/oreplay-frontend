import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ResultListItem from "./ResultListItem.tsx"

const COLUMN_TEST_ID = "column"
const DETAILS_TEST_ID = "details"

describe("ResultListItem", () => {
  it("renders the columns directly inside the item when it has no details", () => {
    const { container } = render(
      <ResultListItem>
        <span data-testid={COLUMN_TEST_ID} />
      </ResultListItem>,
    )

    expect(screen.getByTestId(COLUMN_TEST_ID).parentElement).toBe(container.firstElementChild)
    expect(container.firstElementChild).toHaveClass("flex-row")
  })

  it("renders the details as a second line under the columns", () => {
    const { container } = render(
      <ResultListItem details={<span data-testid={DETAILS_TEST_ID} />}>
        <span data-testid={COLUMN_TEST_ID} />
      </ResultListItem>,
    )
    const item = container.firstElementChild
    const columnsLine = screen.getByTestId(COLUMN_TEST_ID).parentElement

    expect(item).toHaveClass("flex-col")
    expect(columnsLine?.parentElement).toBe(item)
    expect(columnsLine?.nextElementSibling).toBe(screen.getByTestId(DETAILS_TEST_ID))
  })
})
