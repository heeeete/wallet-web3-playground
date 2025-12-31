import { useWalletSignIn } from "@/hooks/useWalletSignIn";
import { calculateBalanceValue, cn } from "@/lib/utils";
import { chains } from "@/lib/wagmi";
import { ArrowLeftRightIcon, BadgeCheckIcon, UserStarIcon } from "lucide-react";
import { toast } from "sonner";
import { formatEther } from "viem";

import { Spinner } from "@/components/ui/spinner";

import { SearchResultType } from "../_lib/types";

export default function ResultGrid({ searchResult }: { searchResult: SearchResultType }) {
    const { signIn, isPending, signedIn } = useWalletSignIn();

    const getChainSymbol = (chainId: number) => {
        const chain = chains.find((c) => c.id === chainId);
        return chain?.nativeCurrency.symbol || "ETH";
    };

    return (
        <div className="grid grid-cols-2 gap-5">
            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                <p>
                    <UserStarIcon className="size-10" />
                </p>
                <p className="font-bold">EOA 주소</p>
            </div>
            {signedIn ? (
                <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5 animate-shimmer">
                    <p className="text-2xl font-bold">
                        <BadgeCheckIcon className="size-10" />
                    </p>
                    <p className="font-bold">본인인증 완료</p>
                </div>
            ) : (
                <button
                    onClick={async () => {
                        const { ok, signature } = await signIn(
                            searchResult.address as `0x${string}`,
                            searchResult.chainId
                        );

                        if (!ok && signature) {
                            toast.error("본인 주소가 아닙니다.");
                        }
                    }}
                    className={cn(
                        "h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-0 hover:bg-main duration-500",
                        isPending && "animate-pulse"
                    )}
                    disabled={isPending}
                >
                    {isPending ? (
                        <Spinner className="size-10" />
                    ) : (
                        <>
                            <p className="text-lg font-bold">서명하기</p>
                            <p className="text-sm text-muted-foreground">
                                본인임을 증명하기 <br /> 위해 서명합니다.
                            </p>
                        </>
                    )}
                </button>
            )}

            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                <p className="text-2xl font-bold">{getChainSymbol(searchResult.chainId)}</p>
                <p className="font-bold">{Number(formatEther(searchResult.balance)).toFixed(4)}</p>
            </div>

            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                <p className="text-2xl font-bold">USDT</p>
                <p className="font-bold">
                    {calculateBalanceValue(searchResult.coinPriceUSDT, searchResult.balance)} USDT
                </p>
            </div>

            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                <p className="text-2xl font-bold">KRW</p>
                <p className="font-bold">
                    ₩ {calculateBalanceValue(searchResult.coinPriceKRW, searchResult.balance)}
                </p>
            </div>

            <div className="h-[150px] bg-background rounded-2xl flex flex-col items-center justify-center gap-5">
                <p className="text-2xl font-bold">
                    <ArrowLeftRightIcon className="size-10" />
                </p>
                <p className="font-bold">{searchResult.count} 회</p>
            </div>
        </div>
    );
}
