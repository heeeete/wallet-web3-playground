import Link from "next/link";

interface TransactionLinkProps {
	txHash?: `0x${string}`;
}

export function TransactionLink({ txHash }: TransactionLinkProps) {
	if (!txHash) return null;

	return (
		<div className="mt-4 p-4 bg-muted rounded-lg">
			<p className="text-sm text-muted-foreground mb-2">트랜잭션 해시:</p>
			<Link
				href={`https://sepolia.etherscan.io/tx/${txHash}`}
				target="_blank"
				className="text-sm text-primary hover:underline break-all"
			>
				{txHash}
			</Link>
		</div>
	);
}

