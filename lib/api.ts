/**
 * 달러 환율 조회 API
 * @returns USD rate
 */
export async function getDollarRate(): Promise<number> {
    const response = await fetch(
        `https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=%ED%99%98%EC%9C%A8&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1`
    );
    const data = await response.json();
    return Number(data.country[1].value.replace(/,/g, ""));
}

/**
 * 코인 가격 조회
 * @param symbol - 코인 심볼
 * @returns 코인 가격
 */
export async function getCoinPrice(symbol: "ETH" | "POL"): Promise<{ krw: number; usdt: number }> {
    const [krw, usdt] = await Promise.all([
        fetch(`https://api.upbit.com/v1/ticker?markets=KRW-${symbol}`),
        fetch(`https://api.upbit.com/v1/ticker?markets=USDT-${symbol}`),
    ]);
    const krwData = await krw.json();
    const usdtData = await usdt.json();

    return {
        krw: krwData[0].trade_price,
        usdt: usdtData[0].trade_price,
    };
}
