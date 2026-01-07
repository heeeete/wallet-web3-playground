"use client";

import { useAccount, useReadContract } from "wagmi";

import {erc20Abi} from "viem";

export default function TokensClient() {
	const { address } = useAccount();

	const {data: balanceRaw} = useReadContract({
		address,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: address ? [address] : undefined,
		query: { enabled: !!address },
	})

	console.log(balanceRaw);
    return <div>
		{JSON.stringify(balanceRaw)}
	</div>;
}
