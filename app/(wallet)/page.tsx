"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther, isAddress } from "viem";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
	const { address } = useAccount();
	const balance = useBalance({ address });
	const maxAmount = balance.data?.value ? Number(formatEther(balance.data.value)) : undefined;

	const formSchema = z.object({
		amount: z
			.number({ message: "금액을 입력해주세요." })
			.refine((val) => val > 0, { message: "금액은 0 이상이어야 합니다." })
			.refine((val) => maxAmount === undefined || val <= maxAmount, {
				message: `잔액을 초과할 수 없습니다. (최대: ${maxAmount?.toFixed(4) ?? 0} ETH)`,
			}),
		recipient: z
			.string()
			.min(1, { message: "전송 주소를 입력해주세요." })
			.refine((val) => isAddress(val), {
				message: "올바른 주소를 입력해주세요.",
			}),
	});
	const { data: txHash, sendTransaction, isPending } = useSendTransaction();
	const receipt = useWaitForTransactionReceipt({ hash: txHash });
	type UiTxState = "idle" | "wallet" | "submitted" | "confirming" | "success" | "error";

	const uiState: UiTxState = receipt.isSuccess
		? "success"
		: receipt.isError
		? "error"
		: txHash && receipt.isLoading
		? "confirming"
		: txHash
		? "submitted"
		: isPending
		? "wallet"
		: "idle";
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			amount: undefined,
			recipient: "",
		},
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
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
						render={({ field }) => (
							<FormItem className="border p-4 rounded-3xl">
								<FormLabel>
									<div className="flex justify-between flex-1 items-center text-muted-foreground">
										<span className="text-lg font-semibold">Amount</span>

										<span>{maxAmount && `Balance: ${maxAmount.toFixed(4)}`}</span>
									</div>
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.0001"
										max={maxAmount}
										value={field.value ?? ""}
										onChange={(e) =>
											field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<ArrowDown className="mx-auto text-main" />
					<FormField
						control={form.control}
						name="recipient"
						render={({ field }) => (
							<FormItem className="border p-4 rounded-3xl">
								<FormLabel>
									<div className="flex justify-between flex-1 items-center text-muted-foreground">
										<span className="text-lg font-semibold">Recipient</span>

										{/* <span>{maxAmount && `Balance: ${maxAmount.toFixed(4)}`}</span> */}
									</div>
								</FormLabel>
								<FormControl>
									<Input value={field.value} onChange={field.onChange} placeholder="0x1cA...D152" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isPending}>
						{(uiState === "wallet" || uiState === "confirming") && <Spinner />}
						{uiState === "wallet"
							? "지갑에서 확인 중..."
							: uiState === "confirming"
							? "확정 대기 중..."
							: "전송"}
					</Button>
				</form>
			</Form>
			<p>
				{txHash && (
					<Link href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank">
						{txHash}
					</Link>
				)}
			</p>
		</div>
	);
}
