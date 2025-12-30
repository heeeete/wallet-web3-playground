"use client";

import { useState } from "react";

import { getCoinPrice, getDollarRate } from "@/lib/api";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { getAddress, isAddress } from "viem";
import { usePublicClient } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";

import { Button } from "@/components/ui/button";

import { SearchResultType } from "../_lib/types";
import ChainSelect from "./ChainSelect";

export default function SearchForm({
    setIsLoading,
    setSearchResult,
    isLoading,
}: {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchResult: React.Dispatch<React.SetStateAction<SearchResultType | null>>;
    isLoading: boolean;
}) {
    const [selectedChainId, setSelectedChainId] = useState<number>(mainnet.id);
    const publicClient = usePublicClient({ chainId: selectedChainId });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const search = String(formData.get("search") ?? "").trim();

        if (!isAddress(search)) {
            toast.error("유효한 주소가 아닙니다.");
            return;
        }

        if (!publicClient) {
            toast.error("네트워크 연결을 확인해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            const address = getAddress(search);

            const [code, balance, count, dollar, coinPriceKRW] = await Promise.all([
                publicClient.getCode({ address }),
                publicClient.getBalance({ address }),
                publicClient.getTransactionCount({ address }),
                getDollarRate(),
                getCoinPrice(selectedChainId === polygon.id ? "POL" : "ETH"),
            ]);

            setSearchResult({
                address,
                balance,
                isContract: code !== undefined,
                code,
                count,
                dollar,
                chainId: selectedChainId,
                coinPriceKRW,
            });
        } catch {
            toast.error("검색 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex gap-2 h-12">
            <div className="flex border border-input bg-input/30 rounded-xl w-full justify-between items-center">
                <input
                    type="text"
                    name="search"
                    placeholder="0x5123..."
                    className="flex-1 h-full px-2 rounded-xl outline-none"
                    disabled={isLoading}
                />
                <ChainSelect
                    selectedChainId={selectedChainId}
                    setSelectedChainId={setSelectedChainId}
                />
            </div>
            <Button type="submit" className="h-full rounded-xl w-15" disabled={isLoading}>
                {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                ) : (
                    <SearchIcon className="size-6" />
                )}
            </Button>
        </form>
    );
}

function getDollar() {}
