"use client";

import SignInButton from "@/components/SignInButton";
import TransferDialog from "@/components/TransferDialog";

import { Button } from "@/components/ui/button";
import { useWalletSignIn } from "@/hooks/useWalletSignIn";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useAccount, useBalance } from "wagmi";

export default function Home() {
	const { address, isConnected, chainId, connector } = useAccount();
	const balance = useBalance({ address });

	const { signIn, isPending, signedIn, error, lastMsg } = useWalletSignIn();

	return (
		<main>
			<div>
				<div>Connected: {String(isConnected)}</div>
				<div>Address: {address ?? "-"}</div>
				<div>ChainId: {chainId ?? "-"}</div>
				<div>Balance status: {balance.isLoading ? "loading" : balance.isError ? "error" : "ok"}</div>
				<div>Balance: {balance.data ? `${balance.data.formatted} ${balance.data.symbol}` : "-"}</div>
			</div>
			<SignInButton onSignIn={signIn} disabled={isPending} isPending={isPending} signedIn={signedIn} />
			<p>{lastMsg}</p>

			<TransferDialog>
				<Button>Transfer</Button>
			</TransferDialog>
		</main>
	);
}
