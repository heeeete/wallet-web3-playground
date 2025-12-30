import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID");

export const chains = [sepolia, mainnet, polygon, base, optimism, arbitrum] as const;

export const wagmiConfig = getDefaultConfig({
    appName: "Web3 Playground",
    projectId,
    chains,
    ssr: true,
});
