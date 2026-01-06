export interface EtherscanTxListItem {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;

    from: string;
    to: string;

    value: string;

    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;

    isError: "0" | "1";
    txreceipt_status?: "0" | "1";

    input: string;
    contractAddress: string;

    confirmations: string;

    methodId?: string;
    functionName?: string;
}

export interface EtherscanTxListResponse {
    status: boolean;
    message?: string;
    transactions?: EtherscanTxListItem[];
}
