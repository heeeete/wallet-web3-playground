import { useWaitForTransactionReceipt } from "wagmi";

type UiTxState = "idle" | "wallet" | "submitted" | "confirming" | "success" | "error";

interface UseTransactionStateParams {
	txHash?: `0x${string}`;
	isPending: boolean;
}

export function useTransactionState({ txHash, isPending }: UseTransactionStateParams) {
	const receipt = useWaitForTransactionReceipt({ hash: txHash });

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

	return { uiState, receipt };
}

