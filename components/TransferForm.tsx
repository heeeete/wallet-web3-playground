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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther, isAddress } from "viem";
import Link from "next/link";

export default function TransferForm() {
	const { address } = useAccount();
	const balance = useBalance({ address });

	console.log("balance", balance.data);

	const maxAmount = balance.data?.value ? Number(formatEther(balance.data.value)) : undefined;

	const formSchema = z.object({
		amount: z
			.number({ message: "숫자를 입력해주세요." })
			.min(0, { message: "금액은 0 이상이어야 합니다." })
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
			amount: 0,
			recipient: "",
		},
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		sendTransaction({
			to: data.recipient as `0x${string}`,
			value: parseEther(data.amount.toString() || "0"),
		});
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>전송 금액 {maxAmount && `(최대: ${maxAmount.toFixed(4)} ETH)`}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.0001"
										max={maxAmount}
										value={field.value}
										onChange={(e) =>
											field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="recipient"
						render={({ field }) => (
							<FormItem>
								<FormLabel>전송 주소</FormLabel>
								<FormControl>
									<Input value={field.value} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isPending}>
						{uiState === "wallet" && "지갑에서 확인 중..."}
						{uiState === "confirming" && "확정 대기 중..."}
						{uiState === "idle" && "전송"}
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
		</>
	);
}
