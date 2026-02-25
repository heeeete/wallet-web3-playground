import { isAddress, parseUnits } from "viem";
import { z } from "zod";

type CreateSchemaParams = {
    decimals: number;
    maxAmountRaw: bigint;
};

// 12. 허용, 12.3 허용, 12 허용
const numberLike = /^\d+(\.\d*)?$/;

// 소수점 자릿수 체크
function isDecimalsWithin(v: string, decimals: number) {
    if (decimals <= 0) return !v.includes(".");
    const dot = v.indexOf(".");
    if (dot === -1) return true;
    return v.length - dot - 1 <= decimals;
}

export const createTransferFormSchema = ({ decimals, maxAmountRaw }: CreateSchemaParams) => {
    return z.object({
        recipient: z
            .string()
            .trim()
            .min(1, { message: "전송 주소를 입력해주세요." })
            .refine((v) => isAddress(v), { message: "올바른 주소를 입력해주세요." }),

        amount: z
            .string()
            .trim()
            .min(1, { message: "금액을 입력해주세요." })
            .refine((v) => numberLike.test(v), { message: "숫자를 입력해주세요." })
            .refine((v) => isDecimalsWithin(v, decimals), {
                message: `소수점은 ${decimals}자리까지 가능합니다.`,
            })
            .transform((v) => {
                // "1." 같은 케이스 처리
                const normalized = v.endsWith(".") ? v.slice(0, -1) : v;
                return parseUnits(normalized === "" ? "0" : normalized, decimals);
            })
            .refine((v) => v > 0n, { message: "금액은 0보다 커야 합니다." })
            .refine((v) => v <= maxAmountRaw, { message: "잔액을 초과할 수 없습니다." }),
    });
};

export type TransferFormInput = z.input<ReturnType<typeof createTransferFormSchema>>;
export type TransferFormValues = z.output<ReturnType<typeof createTransferFormSchema>>;
