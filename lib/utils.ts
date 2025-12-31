import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatNumberFixed = (value: number, digits = 4) =>
    new Intl.NumberFormat(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);

export function formatFixedBigint(value: bigint, digits: number, locale?: string) {
    const sign = value < 0n ? "-" : "";
    const v = value < 0n ? -value : value;

    const base = 10n ** BigInt(digits);
    const intPart = v / base;
    const fracPart = v % base;

    const intFormatted = new Intl.NumberFormat(locale).format(intPart);
    const fracStr = fracPart.toString().padStart(digits, "0");

    return digits > 0 ? `${sign}${intFormatted}.${fracStr}` : `${sign}${intFormatted}`;
}

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
