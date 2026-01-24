import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider, createConfig } from 'wagmi'
import { monadTestnet } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'

// Robust connector setup
const connectors = typeof window !== 'undefined' ? [
  injected(),
  metaMask(),
  safe(),
  miniAppConnector()
] : [];

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors,
  ssr: true,
})

const queryClient = new QueryClient()

export function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
