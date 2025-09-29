"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { targetChain, rpcUrl } from "../lib/chains";

const config = createConfig({
  autoConnect: true,
  chains: [targetChain],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [targetChain.id]: http(rpcUrl)
  }
});

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
