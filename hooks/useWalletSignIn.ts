import { useCallback, useState } from "react";

import { verifyMessage } from "viem";
import { useSignMessage } from "wagmi";

function makeMessage(address: string, chainId?: number) {
    const nonce = Math.random().toString(36).slice(2);
    const now = new Date().toISOString();
    return [
        "Web3 Playground Login",
        `Address: ${address}`,
        `ChainId: ${chainId ?? "unknown"}`,
        `Nonce: ${nonce}`,
        `IssuedAt: ${now}`,
        "",
        "I am proving I own this wallet by signing this message.",
    ].join("\n");
}

export function useWalletSignIn() {
    const { signMessageAsync, isPending } = useSignMessage();

    const [signedIn, setSignedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastMsg, setLastMsg] = useState<string | null>(null);

    const signIn = useCallback(
        async (targetAddress: `0x${string}`, chainId: number) => {
            if (!targetAddress) return { ok: false, reason: "NO_ADDRESS" as const };

            setError(null);

            const message = makeMessage(targetAddress, chainId);
            setLastMsg(message);

            try {
                const sig = await signMessageAsync({ message });
                const ok = await verifyMessage({ address: targetAddress, message, signature: sig });

                setSignedIn(ok);
                if (!ok) setError("Signature verification failed.");

                return { ok, message, signature: sig } as const;
            } catch (e: unknown) {
                setSignedIn(false);
                setError(e instanceof Error ? e.message : "Sign failed.");
                return { ok: false, reason: "FAILED" as const };
            }
        },
        [signMessageAsync]
    );

    const signReset = useCallback(() => {
        setSignedIn(false);
        setError(null);
        setLastMsg(null);
    }, []);

    return {
        signIn,
        isPending,
        signedIn,
        error,
        lastMsg,
        setSignedIn,
        setError,
        signReset,
    };
}
