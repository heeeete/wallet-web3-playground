"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

import { TxListItem } from "./_components/TxListItem";
import type { EtherscanTxListResponse } from "./_lib/type";

export default function HistoryPage() {
    const { address, chainId, chain } = useAccount();
    const { data, isLoading, error } = useQuery<EtherscanTxListResponse>({
        queryKey: ["transactions", address, chainId],
        queryFn: () =>
            fetch(
                `/api/chains/ethereum/transactions?address=${address}&chainId=${chainId}&chain=${chain?.name}`
            ).then((res) => res.json()),
        enabled: !!address && !!chainId && !!chain?.name,
        staleTime: 1000 * 5,
    });

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner className="size-10" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-sm text-destructive">트랜잭션 조회 중 오류가 발생했습니다.</p>
            </div>
        );
    }

    if (!data?.status && data?.message) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">{data.message}</p>
            </div>
        );
    }

    if (!data?.transactions || data.transactions.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground">트랜잭션 내역이 없습니다.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-full">
            <div className="flex flex-col gap-4 w-full">
                {data.transactions.map((transaction) => (
                    <TxListItem key={transaction.hash} transaction={transaction} />
                ))}
            </div>
        </ScrollArea>
    );
}
