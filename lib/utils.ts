import Big from "big.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateBalanceValue(coinPrice: string, balanceWei: bigint, digits = 4): string {
    return addThousandsSep(
        Big(balanceWei.toString())
            .times(coinPrice)
            .div(10 ** 18)
            .round(digits)
            .toFixed(digits)
    );
}

export function addThousandsSep(s: string) {
    const [intPart, fracPart] = s.split(".");
    const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (!fracPart) return withComma;

    const trimmedFrac = fracPart.replace(/0+$/, "");
    return trimmedFrac ? `${withComma}.${trimmedFrac}` : withComma;
}
