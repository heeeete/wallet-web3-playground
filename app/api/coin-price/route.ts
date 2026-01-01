import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol || (symbol !== "ETH" && symbol !== "POL")) {
        return NextResponse.json(
            { error: "올바른 심볼을 입력해주세요 (ETH 또는 POL)" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://api.upbit.com/v1/ticker?markets=KRW-${symbol},USDT-${symbol}`,
            { cache: "no-store" }
        );

        const data = await response.json();

        return NextResponse.json({
            krw: data[0].trade_price,
            usdt: data[1].trade_price,
        });
    } catch {
        return NextResponse.json({ error: "코인 가격을 가져오는데 실패했습니다" }, { status: 500 });
    }
}
