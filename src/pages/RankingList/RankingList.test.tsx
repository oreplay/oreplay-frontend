import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import RankingList from "./RankingList.tsx"

vi.mock("../../infrastructure/repositories/ranking-settings/ranking-settings.ts", () => ({
  useGetListRankingSettings: () => ({
    data: {
      data: [
        { id: "regional-2025", title: "Regional 2025", max_points: 99 },
        { id: "national-2026", title: "National 2026", max_points: 1000 },
      ],
    },
    isLoading: false,
    isError: false,
  }),
}))

const renderWithProviders = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
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
    expect(await screen.findByText("Regional 2025")).toBeInTheDocument()
    expect(await screen.findByText("National 2026")).toBeInTheDocument()
  })
})
