"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown } from "lucide-react";
import { type Control, useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatEther } from "viem";
import { useAccount, useBalance, usePublicClient, useSendTransaction } from "wagmi";

import { Form, FormField } from "@/components/ui/form";

import { NotConnected } from "../../../components/NotConnected";
import { useTransactionState } from "../_hooks/useTransactionState";
import {
    type TransferFormInput,
    type TransferFormValues,
    createTransferFormSchema,
} from "../_lib/transferFormSchema";
import { AmountField } from "./AmountField";
import { RecipientField } from "./RecipientField";
import { SubmitButton } from "./SubmitButton";
import { TransactionLink } from "./TransactionLink";

export default function Home() {
    const { address, chainId } = useAccount();
    const balance = useBalance({ address });
    const publicClient = usePublicClient({ chainId });
    const { data: txHash, sendTransaction, isPending } = useSendTransaction();
    const { uiState } = useTransactionState({ txHash, isPending });

    const GAS_RESERVE = 0.0;
    const maxAmount = balance.data?.value
        ? Math.max(0, Number(formatEther(balance.data.value)) - GAS_RESERVE)
        : undefined;

    const schema = useMemo(() => {
        return createTransferFormSchema({
            decimals: 18,
            maxAmountRaw: balance.data?.value ?? 0n,
        });
    }, [balance.data?.value]);

    const form = useForm<TransferFormInput, unknown, TransferFormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            amount: "",
            recipient: "",
        },
    });

    const onSubmit = async (data: TransferFormValues) => {
        if (!publicClient) return;

        const feeValues = await publicClient.estimateFeesPerGas();
        const maxPriorityFeePerGas = feeValues.maxPriorityFeePerGas;
        const maxFeePerGas = feeValues.maxFeePerGas;

        sendTransaction({
            to: data.recipient as `0x${string}`,
            value: data.amount,
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    };

    useEffect(() => {
        console.log(uiState);
        if (uiState === "success") {
            toast.success("트랜잭션이 성공적으로 완료되었습니다.");
            balance.refetch();
            form.reset();
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
                        control={form.control as unknown as Control<TransferFormInput>}
                        name="amount"
                        render={({ field }) => (
                            <AmountField field={field} maxAmount={maxAmount} uiState={uiState} />
                        )}
                    />

                    <ArrowDown className="mx-auto text-main" />

                    <FormField
                        control={form.control as unknown as Control<TransferFormInput>}
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
