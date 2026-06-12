import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import RankingList from "./RankingList.tsx"

const renderWithProviders = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RankingList />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("RankingList", () => {
  it("renders the rankings returned by the api", async () => {
    renderWithProviders()
    expect(await screen.findByText("regional-2026")).toBeInTheDocument()
    expect(await screen.findByText("national-2026")).toBeInTheDocument()
  })
})
