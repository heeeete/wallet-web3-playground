"use client";

import { useState } from "react";

import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { getAddress, isAddress } from "viem";
import { usePublicClient } from "wagmi";
import { mainnet } from "wagmi/chains";

import { Button } from "@/components/ui/button";

import { SearchResult } from "../type";
import ChainSelect from "./ChainSelect";

export default function SearchForm({
    setSearchResult,
}: {
    setSearchResult: React.Dispatch<React.SetStateAction<SearchResult | null>>;
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

        const address = getAddress(search);

        const [code, balance, count, dollar] = await Promise.all([
            publicClient.getCode({ address }),
            publicClient.getBalance({ address }),
            publicClient.getTransactionCount({ address }),
            fetch(
                `https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1`
            ),
        ]);

        const dollarResponse = await dollar.json();

        setSearchResult({
            address,
            balance,
            isContract: code !== undefined,
            code,
            count,
            dollar: Number(dollarResponse.country[1].value.replace(/,/g, "")),
        });
    };

    return (
        <form onSubmit={onSubmit} className="flex gap-2 h-12">
            <div className="flex border border-input bg-input/30 rounded-xl w-full justify-between items-center">
                <input
                    type="text"
                    name="search"
                    placeholder="0x5123..."
                    className="flex-1 h-full px-2 rounded-2xl"
                />
                <ChainSelect
                    selectedChainId={selectedChainId}
                    setSelectedChainId={setSelectedChainId}
                />
            </div>
            <Button type="submit" className="h-full rounded-xl w-15">
                <SearchIcon className="size-6" />
            </Button>
        </form>
    );
}
