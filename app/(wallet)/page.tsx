"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, WalletIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance, useSendTransaction } from "wagmi";

import { Form, FormField } from "@/components/ui/form";

import { AmountField } from "./_components/AmountField";
import { RecipientField } from "./_components/RecipientField";
import { SubmitButton } from "./_components/SubmitButton";
import { TransactionLink } from "./_components/TransactionLink";
import { TransferFormData, createTransferFormSchema } from "./_components/transferFormSchema";
import { useTransactionState } from "./_components/useTransactionState";

export default function Home() {
    const { address } = useAccount();
    const balance = useBalance({ address });
    const maxAmount = balance.data?.value ? Number(formatEther(balance.data.value)) : undefined;

    const formSchema = createTransferFormSchema(maxAmount);
    const { data: txHash, sendTransaction, isPending } = useSendTransaction();
    const { uiState } = useTransactionState({ txHash, isPending });

    const form = useForm<TransferFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: undefined,
            recipient: "",
        },
    });

    const onSubmit = (data: TransferFormData) => {
        sendTransaction({
            to: data.recipient as `0x${string}`,
            value: parseEther(data.amount.toString()),
        });
    };

    useEffect(() => {
        if (uiState === "success") {
            toast.success("트랜잭션이 성공적으로 완료되었습니다.");
        } else if (uiState === "error") {
            toast.error("트랜잭션이 실패했습니다.");
        }
    }, [uiState]);

    if (!address) {
        return (
            <div>
                <p>
                    <WalletIcon className="size-10" />
                </p>
                <p>지갑을 연결해주세요.</p>
            </div>
        );
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
                        render={({ field }) => <AmountField field={field} maxAmount={maxAmount} />}
                    />

                    <ArrowDown className="mx-auto text-main" />

                    <FormField
                        control={form.control}
                        name="recipient"
                        render={({ field }) => <RecipientField field={field} />}
                    />

                    <SubmitButton uiState={uiState} isPending={isPending} />
                </form>
            </Form>

            <TransactionLink txHash={txHash} />
        </div>
    );
}
