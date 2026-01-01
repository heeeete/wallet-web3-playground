"use client";

import * as React from "react";

import { wagmiConfig } from "@/lib/wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

function RainbowKitWithTheme({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme(); // 'light' | 'dark'
    // const rkTheme = resolvedTheme === "dark" ? darkTheme() : lightTheme();
    const rkTheme = darkTheme();

    return (
        <RainbowKitProvider coolMode theme={rkTheme}>
            {children}
        </RainbowKitProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitWithTheme>{children}</RainbowKitWithTheme>
                </QueryClientProvider>
            </WagmiProvider>
        </ThemeProvider>
    );
}
