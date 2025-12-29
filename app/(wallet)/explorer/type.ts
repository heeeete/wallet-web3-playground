export interface SearchResult {
	address: string;
	balance: bigint;
	isContract: boolean;
	code: string | undefined;
	count: number;
	dollar: number;
}
