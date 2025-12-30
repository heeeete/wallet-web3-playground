import { formatNumberFixed } from "@/lib/utils";
import { chains } from "@/lib/wagmi";
import { ArrowLeftRightIcon, CpuIcon, UserStarIcon } from "lucide-react";
import { formatEther } from "viem";

import { Spinner } from "@/components/ui/spinner";

import { SearchResultType } from "../_lib/types";

export default function SearchResult({
    searchResult,
    isLoading,
}: {
    searchResult: SearchResultType | null;
    isLoading: boolean;
}) {
    if (isLoading) {
        return (
            <div className=" mt-20 flex justify-center items-center">
                <Spinner className="size-10" />
            </div>
        );
    }

    const getChainInfo = (chainId: number) => {
        const chain = chains.find((c) => c.id === chainId);
        return chain?.nativeCurrency.symbol || "ETH";
    };

    return (
        <div className="overflow-y-auto flex-1">
            {searchResult && (
                <>
                    {searchResult?.isContract ? (
                        <div className="flex flex-col items-center gap-5">
                            <p>
                                <CpuIcon className="size-10" />
                            </p>
                            <p className="font-bold">컨트렉트 주소입니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-5">
                            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                                <p>
                                    <UserStarIcon className="size-10" />
                                </p>
                                <p className="font-bold">EOA 주소</p>
                            </div>
                            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                                <p className="text-2xl font-bold">
                                    {getChainInfo(searchResult.chainId)}
                                </p>
                                <p className="font-bold">
                                    {Number(formatEther(searchResult.balance)).toFixed(4)}
                                </p>
                            </div>

                            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                                <p className="text-2xl font-bold">USD</p>
                                <p className="font-bold">
                                    $
                                    {getUSD(
                                        searchResult.dollar,
                                        searchResult.coinPriceKRW,
                                        searchResult.balance
                                    )}
                                </p>
                            </div>

                            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                                <p className="text-2xl font-bold">KRW</p>
                                <p className="font-bold">
                                    ₩{getKRW(searchResult.coinPriceKRW, searchResult.balance)}
                                </p>
                            </div>

                            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                                <p className="text-2xl font-bold">
                                    <ArrowLeftRightIcon className="size-10" />
                                </p>
                                <p className="font-bold">{searchResult.count} 회</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function getUSD(dollar: number, coinPriceKRW: number, balance: bigint): string {
    const numberBalance = Number(formatEther(balance));

    return formatNumberFixed((coinPriceKRW / dollar) * numberBalance);
}

function getKRW(coinPriceKRW: number, balance: bigint): string {
    const numberBalance = Number(formatEther(balance));

    return formatNumberFixed(numberBalance * coinPriceKRW);
}
