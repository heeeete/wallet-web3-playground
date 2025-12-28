"use client";

import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ArrowDown } from "lucide-react";
import { AmountField } from "./_components/AmountField";
import { RecipientField } from "./_components/RecipientField";
import { SubmitButton } from "./_components/SubmitButton";
import { TransactionLink } from "./_components/TransactionLink";
import { createTransferFormSchema, TransferFormData } from "./_components/transferFormSchema";
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

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
