"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
	const { address, isConnected, chainId } = useAccount();

	return (
		<main>
			<ConnectButton />
			<div>
				<div>Connected: {String(isConnected)}</div>
				<div>Address: {address ?? "-"}</div>
				<div>ChainId: {chainId ?? "-"}</div>
			</div>
		</main>
	);
}
