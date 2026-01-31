import { useWalletSignIn } from "@/hooks/useWalletSignIn";
import { addThousandsSep, calculateBalanceValue, cn } from "@/lib/utils";
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

    const cardBase =
        "h-[150px] rounded-3xl border bg-background p-4 shadow-sm flex flex-col justify-between";
    const cardCenter =
        "h-[150px] rounded-3xl border bg-background p-4 shadow-sm flex flex-col items-center justify-center gap-3";
    const label = "text-sm text-muted-foreground";
    const value = "text-xl font-bold";

    const chainSymbol = getChainSymbol(searchResult.chainId);

    return (
        <div className="grid grid-cols-2 gap-5">
            {/* EOA */}
            <div className={cardCenter}>
                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground">
                    <UserStarIcon className="size-5" />
                </span>
                <p className="font-semibold">EOA 주소</p>
            </div>

            {/* 서명 완료 / 서명 */}
            {signedIn ? (
                <div className={cn(cardCenter, "animate-shimmer")}>
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground">
                        <BadgeCheckIcon className="size-5" />
                    </span>
                    <p className="font-semibold">본인인증 완료</p>
                </div>
            ) : (
                <button
                    onClick={async () => {
                        const { ok, signature } = await signIn(
                            searchResult.address as `0x${string}`,
                            searchResult.chainId
                        );

                        if (!ok && signature) toast.error("본인 주소가 아닙니다.");
                    }}
                    disabled={isPending}
                    className={cn(
                        cardCenter,
                        "transition-colors hover:bg-muted/30 hover:border-muted-foreground/30",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                        isPending && "opacity-80"
                    )}
                >
                    {isPending ? (
                        <Spinner className="size-10" />
                    ) : (
                        <>
                            <p className="text-lg font-bold">서명하기</p>
                            <p className="text-sm text-muted-foreground leading-relaxed text-center">
                                본인임을 증명하기 위해 <br /> 서명합니다.
                            </p>
                        </>
                    )}
                </button>
            )}

            {/* Native balance */}
            <div className={cardBase}>
                <p className={label}>{chainSymbol}</p>
                <p className={cn(value)}>
                    {addThousandsSep(Number(formatEther(searchResult.balance)).toFixed(4))}
                </p>
            </div>

            {/* USDT */}
            <div className={cardBase}>
                <p className={label}>USDT</p>
                <p className={cn(value)}>
                    {calculateBalanceValue(
                        searchResult.coinPriceUSDT.toString(),
                        searchResult.balance
                    )}{" "}
                    <span className="text-sm font-semibold text-muted-foreground">USDT</span>
                </p>
            </div>

            {/* KRW */}
            <div className={cardBase}>
                <p className={label}>KRW</p>
                <p className={cn(value)}>
                    <span className={cn(label)}>₩</span>{" "}
                    {calculateBalanceValue(
                        searchResult.coinPriceKRW.toString(),
                        searchResult.balance
                    )}
                </p>
            </div>

            {/* Count */}
            <div className={cardCenter}>
                <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground">
                    <ArrowLeftRightIcon className="size-5" />
                </span>
                <p className="font-semibold">
                    <span>{searchResult.count}</span> 회
                </p>
            </div>
        </div>
    );
}
