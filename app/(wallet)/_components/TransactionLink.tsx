import { chains } from "@/lib/wagmi";
import { Link2 } from "lucide-react";
import Link from "next/link";

interface TransactionLinkProps {
    txHash?: `0x${string}`;
    chainId: number;
}

export function TransactionLink({ txHash, chainId }: TransactionLinkProps) {
    if (!txHash) return null;

    const chain = chains.find((c) => c.id === chainId);
    const explorerUrl = chain?.blockExplorers?.default.url || "https://etherscan.io";
    const txUrl = `${explorerUrl}/tx/${txHash}`;

    return (
        <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <Link2 className="size-5" />
                <p>트랜잭션 해시</p>
            </div>
            <Link
                href={txUrl}
                target="_blank"
                className="text-sm text-primary hover:underline break-all"
            >
                {txHash}
            </Link>
        </div>
    );
}
