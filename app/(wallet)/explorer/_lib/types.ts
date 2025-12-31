export interface SearchResultType {
    address: string;
    balance: bigint;
    isContract: boolean;
    code: string | undefined;
    count: number;
    dollarRate: number;
    chainId: number;
    coinPriceKRW: number;
    coinPriceUSDT: number;
}
