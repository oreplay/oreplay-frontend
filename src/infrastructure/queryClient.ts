import { QueryClient } from "react-query"

/**
 * The app's single React Query client, provided to the React tree in `main.tsx` and importable by
 * services, so code running outside React can update cached data too.
 */
export const queryClient = new QueryClient()
