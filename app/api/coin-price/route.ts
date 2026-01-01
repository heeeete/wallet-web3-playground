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
        const [krw, usdt] = await Promise.all([
            fetch(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`, {
                cache: "no-store",
            }),
            fetch(`https://api.upbit.com/v1/ticker?markets=USDT-${symbol}`, {
                cache: "no-store",
            }),
        ]);

        const krwData = await krw.json();
        const usdtData = await usdt.json();

        return NextResponse.json({
            krw: krwData[0].trade_price,
            usdt: usdtData[0].trade_price,
        });
    } catch {
        return NextResponse.json({ error: "코인 가격을 가져오는데 실패했습니다" }, { status: 500 });
    }
}
