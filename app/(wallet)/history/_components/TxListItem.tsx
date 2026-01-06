import dayjs from "dayjs";
import {
    CheckCircle2Icon,
    FuelIcon,
    HandCoinsIcon,
    Link2Icon,
    TimerIcon,
    XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

import { MyCard } from "@/components/ui/card";

import type { EtherscanTxListItem } from "../_lib/type";

export function TxListItem({ transaction }: { transaction: EtherscanTxListItem }) {
    const { chain } = useAccount();

    const explorerUrl = chain?.blockExplorers?.default.url || "https://etherscan.io";
    const txUrl = `${explorerUrl}/tx/${transaction.hash}`;
    const isSuccess = getTxSuccess(transaction);

    return (
        <MyCard role="article" aria-label="트랜잭션 정보">
            <div className="flex items-center gap-2">
                <span
                    className="inline-flex size-8 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground"
                    aria-hidden="true"
                >
                    <Link2Icon className="size-4" />
                </span>
                <Link
                    href={txUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm truncate hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                    aria-label={`트랜잭션 해시 ${transaction.hash} 상세 보기`}
                >
                    {transaction.hash}
                </Link>
            </div>

            <div className="flex items-center gap-2" aria-label="전송 금액">
                <span
                    className="inline-flex size-8 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground"
                    aria-hidden="true"
                >
                    <HandCoinsIcon className="size-4" />
                </span>
                <span className="text-sm truncate">
                    <span className="sr-only">전송 금액: </span>
                    {formatEther(BigInt(transaction.value))} {chain?.nativeCurrency.symbol}
                </span>
            </div>

            <div className="flex items-center gap-2" aria-label="가스 비용">
                <span
                    className="inline-flex size-8 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground"
                    aria-hidden="true"
                >
                    <FuelIcon className="size-4" />
                </span>
                <span className="text-sm truncate">
                    <span className="sr-only">가스 비용: </span>
                    {formatEther(BigInt(transaction.gasUsed) * BigInt(transaction.gasPrice))}{" "}
                    {chain?.nativeCurrency.symbol}
                </span>
            </div>

            <div className="flex items-center gap-2" aria-label="발신 주소">
                <span
                    className="inline-flex size-8 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground text-sm"
                    aria-hidden="true"
                >
                    F
                </span>
                <span className="text-sm truncate">
                    <span className="sr-only">발신: </span>
                    {transaction.from}
                </span>
            </div>

            <div className="flex items-center gap-2" aria-label="수신 주소">
                <span
                    className="inline-flex size-8 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground text-sm"
                    aria-hidden="true"
                >
                    T
                </span>
                <span className="text-sm truncate">
                    <span className="sr-only">수신: </span>
                    {transaction.to}
                </span>
            </div>

            <div className="flex items-center gap-2" aria-label="트랜잭션 시간">
                <span
                    className="inline-flex size-8 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground text-sm"
                    aria-hidden="true"
                >
                    <TimerIcon className="size-4" />
                </span>
                <time
                    className="text-sm truncate"
                    dateTime={new Date(Number(transaction.timeStamp) * 1000).toISOString()}
                >
                    <span className="sr-only">시간: </span>
                    {dayjs(new Date(Number(transaction.timeStamp) * 1000)).format(
                        "YYYY-MM-DD HH:mm:ss"
                    )}
                </time>
            </div>

            <div
                className="flex items-center justify-center gap-2"
                role="status"
                aria-live="polite"
            >
                {isSuccess ? (
                    <>
                        <CheckCircle2Icon className="size-5 text-green-500" aria-hidden="true" />
                        <span className="text-green-500 font-semibold">
                            성공
                            <span className="sr-only"> - 트랜잭션이 성공적으로 완료되었습니다</span>
                        </span>
                    </>
                ) : (
                    <>
                        <XCircleIcon className="size-5 text-red-500" aria-hidden="true" />
                        <span className="text-red-500 font-semibold">
                            실패
                            <span className="sr-only"> - 트랜잭션이 실패했습니다</span>
                        </span>
                    </>
                )}
            </div>
        </MyCard>
    );
}

function getTxSuccess(tx: EtherscanTxListItem): boolean | null {
    const byIsError = tx.isError === "0";

    if (tx.txreceipt_status === undefined) {
        return byIsError;
    }

    const byReceipt = tx.txreceipt_status === "1";

    if (byIsError !== byReceipt) return null;

    return byReceipt;
}
