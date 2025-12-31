import { formatFixedBigint } from "@/lib/utils";
import { parseUnits } from "viem";

export function calculateBalanceValue(
    coinPrice: number,
    balanceWei: bigint,
    digits = 4,
    locale?: string
): string {
    const WEI_DECIMALS = 18n;
    const priceScaled = parseUnits(coinPrice.toString(), digits);

    const denom = 10n ** WEI_DECIMALS;
    const num = balanceWei * priceScaled;
    const amountScaled = (num + denom / 2n) / denom;

    return formatFixedBigint(amountScaled, digits, locale);
}
