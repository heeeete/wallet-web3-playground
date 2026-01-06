import { EtherscanTxListItem, EtherscanTxListResponse } from "@/app/(wallet)/history/_lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const chainId = searchParams.get("chainId");
    const chain = searchParams.get("chain");

    if (chain === "OP Mainnet" || chain === "Base") {
        return NextResponse.json<EtherscanTxListResponse>(
            {
                status: false,
                message: "해당 체인은 지원하지 않습니다.",
                transactions: [],
            },
            { status: 400 }
        );
    }

    if (!address || !chainId) {
        return NextResponse.json<EtherscanTxListResponse>(
            {
                status: false,
                message: "주소와 체인 ID 파라미터가 필요합니다.",
                transactions: [],
            },
            { status: 400 }
        );
    }

    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
        return NextResponse.json<EtherscanTxListResponse>(
            {
                status: false,
                message: "ETHERSCAN_API_KEY 환경 변수가 필요합니다.",
                transactions: [],
            },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://api.etherscan.io/v2/api?module=account&action=txlist&address=${address}&chainId=${chainId}&apikey=${apiKey}`
        );

        if (!response.ok) {
            return NextResponse.json<EtherscanTxListResponse>(
                {
                    status: false,
                    message: "Etherscan API 요청에 실패했습니다.",
                    transactions: [],
                },
                { status: response.status }
            );
        }

        const data: { result: EtherscanTxListItem[] } = await response.json();

        return NextResponse.json<EtherscanTxListResponse>({
            status: true,
            transactions:
                data?.result?.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp)) || [],
        });
    } catch (error) {
        console.error("트랜잭션 조회 오류:", error);
        return NextResponse.json<EtherscanTxListResponse>(
            {
                status: false,
                message: "트랜잭션 조회 중 오류가 발생했습니다.",
                transactions: [],
            },
            { status: 500 }
        );
    }
}
