"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance, usePublicClient, useSendTransaction } from "wagmi";
import z from "zod";

import { Form, FormField } from "@/components/ui/form";

import { NotConnected } from "../../../components/NotConnected";
import { AmountField } from "./AmountField";
import { RecipientField } from "./RecipientField";
import { SubmitButton } from "./SubmitButton";
import { TransactionLink } from "./TransactionLink";
import { useTransactionState } from "../_hooks/useTransactionState";
import { createTransferFormSchema } from "../_lib/transferFormSchema";

export default function Home() {
    const { address, chainId } = useAccount();
    const balance = useBalance({ address });
    const GAS_RESERVE = 0.001; // 가스비 예약
    const maxAmount = balance.data?.value
        ? Math.max(0, Number(formatEther(balance.data.value)) - GAS_RESERVE)
        : undefined;
    const publicClient = usePublicClient({ chainId });
    const formSchema = createTransferFormSchema(maxAmount);
    const { data: txHash, sendTransaction, isPending } = useSendTransaction();
    const { uiState } = useTransactionState({ txHash, isPending });

    const form = useForm<z.input<typeof formSchema>, unknown, z.input<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: undefined,
            recipient: "",
        },
    });

    const onSubmit = async (data: z.input<typeof formSchema>) => {
        if (!publicClient) return;

        const feeValues = await publicClient.estimateFeesPerGas();

        const maxPriorityFeePerGas = feeValues.maxPriorityFeePerGas;
        const maxFeePerGas = feeValues.maxFeePerGas;

        sendTransaction({
            to: data.recipient as `0x${string}`,
            value: parseEther(data.amount.toString()),
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    };

    useEffect(() => {
        if (uiState === "success") {
            toast.success("트랜잭션이 성공적으로 완료되었습니다.");
            balance.refetch(); // 잔액 새로고침
            form.reset(); // 폼 초기화
        } else if (uiState === "error") {
            toast.error("트랜잭션이 실패했습니다.");
        }
    }, [uiState, form]);

    if (!address) {
        return <NotConnected />;
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <AmountField field={field} maxAmount={maxAmount} uiState={uiState} />
                        )}
                    />

                    <ArrowDown className="mx-auto text-main" />

                    <FormField
                        control={form.control}
                        name="recipient"
                        render={({ field }) => <RecipientField field={field} uiState={uiState} />}
                    />

                    <SubmitButton uiState={uiState} isPending={isPending} />
                </form>
            </Form>

            <TransactionLink txHash={txHash} chainId={chainId!} />
        </div>
    );
}
