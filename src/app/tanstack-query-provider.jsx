"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TanStackQueryProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanStackQueryProvider;
