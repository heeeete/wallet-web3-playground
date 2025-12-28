import { z } from "zod";
import { isAddress } from "viem";

export const createTransferFormSchema = (maxAmount?: number) => {
	return z.object({
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
};

export type TransferFormData = z.infer<ReturnType<typeof createTransferFormSchema>>;

