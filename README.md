# Wallet (Web3 Playground)

사이트 주소 - https://wallet-web3-playground.vercel.app

Next.js(App Router) + RainbowKit + wagmi/viem으로 만든 **간단한 Web3 지갑 dApp**입니다.  
**지갑 연결, 코인 전송, 주소록, 주소/컨트랙트 탐색(Explorer)** 기능을 구현했습니다.


---

## 주요 기능

### 1) Wallet Connect

- RainbowKit `ConnectButton`으로 지갑 연결
- 연결 상태(주소, 체인) 기반으로 화면/기능 활성화

### 2) Send (가상자산 전송)
<img width="1498" height="945" alt="localhost_3000_" src="https://github.com/user-attachments/assets/1c7ed760-1752-40ce-852b-9e3f1769ff45" />

- 수신자 주소 + 금액 입력 후 트랜잭션 전송
- 전송 상태 UX 분리
    - **요청(pending)**: 지갑에서 서명/승인 대기
    - **컨펌(confirming)**: 블록에 포함될 때까지 대기
    - **성공/실패**: wagmi에서 제공하는 트랜잭션 상태를 기반으로 결과 표시
- 각 체인의 트랜잭션 조회 링크 제공
- 트랜잭션 무한 Pending 방지
    - wagmi 기본값 대신 **`viem estimateFeesPerGas`** 로 가스비 사전 산정

### 3) Address Book (Zustand)
<img width="1498" height="945" alt="localhost_3000_ (1)" src="https://github.com/user-attachments/assets/20efcdc4-2481-4234-963d-599c7a4341a8" />

- 자주 쓰는 주소를 저장/관리
- 주소록에서 `Send` 버튼 클릭 시 Transfer 화면으로 이동하면서 **주소 자동 채움**
    - 방식: `/?address=0x...` (URL 기반)

### 4) Explorer (Address Lookup)
<img width="1498" height="945" alt="localhost_3000_explorer" src="https://github.com/user-attachments/assets/9f498f78-0c28-459b-be53-908726f4f1ed" />

주소를 입력하면 정보를 조회해 보여줍니다.

- **본인 확인 기능**
    - `useWalletSignIn` 커스텀 훅으로 메시지 서명 + 검증
    - `signMessageAsync`로 지갑 서명 요청 → `verifyMessage`로 서명 검증
    - 조회 주소가 본인 소유임을 증명

<img width="500" height="auto" alt="image" src="https://github.com/user-attachments/assets/7e90f832-3ac5-489a-b11e-02ad18424a9c" />

- **EOA / Contract 구분**
    - `publicClient.getCode({ address })`
    - `code`가 존재하면 Contract, 없으면 EOA(viem은 code 없는 경우 `undefined` 반환)
- **잔고 조회**
    - `publicClient.getBalance({ address, chainId })`
- **트랜잭션 횟수(Nonce)**
    - `publicClient.getTransactionCount({ address })`
- **원화(KRW) / USDT 환산 표시**
    - 코인 시세: 업비트 Ticker API -> `getCoinPrice()`
    - 부동소수점 문제를 해결하기 위해 BigInt 기반 고정소수점 연산 구현
        - `calculateBalanceValue()`: Wei 단위 잔고와 시세를 BigInt로 곱셈/나눗셈
        - `formatFixedBigint()`: 정밀도 손실 없이 포맷팅

---

## 프로젝트 진행 중 발생한 문제

- #### 배포 후 브라우저에서 **Upbit 시세 API를 직접 호출**할 때 아래 **오류가 발생**
    - 에러 내용
        - Access to fetch at 'https://api.upbit.com/v1/ticker?markets=KRW-ETH' from origin 'https://wallet-web3-playground.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
        - GET https://api.upbit.com/v1/ticker?markets=KRW-ETH net::ERR_FAILED 429 (Too Many Requests)
    - 에러 해석
        - CORS 차단과 429 응답이 동시에 나고 있다
        - 헤더를 보니 오리진마다 제한이 있는 걸로 확인 `(limit-by-origin : yes)`
    - 해결 방법 1)
        - **Upbit 시세 API 호출을 Next.js API Route로 요청해 봤다.**
            - 결과는 200 응답
            - **CORS는 브라우저에서만 적용되는 정책이므로, API Route(서버)에서 Upbit를 호출하면 브라우저 CORS 차단이 발생하지 않는다.**
    - 해결 방법 2)
        - Upbit API를 기존에 KRW-ETH / USDT-ETH 총 2번 호출했다. 알아보니 콤마로 구분해 한 번에 여러 시세를 받을 수 있었다.
    - 최종 해결
        - 위 1, 2번 방법을 동시에 적용

- #### 잔액 KRW/USDT 계산 시 정밀도 손실 문제 해결
    - 문제 
        - 적은 단위는 문제가 안 되지만 계산 값이 `9007199254740991` 이상 넘어갈 시 일정 단위 뒤부터 0으로 표시되는 문제
    - 원인
        - JS의 숫자는 부동소수점으로 큰 값을 계산 시 정밀도가 보장되지 않는다.
        ```js
        // Number로 변환되어 정밀도 손실
        const value = price * Number(formatEther(balance));
        ```
    - 해결 방법
        - BigInt를 끝까지 유지하며 계산 후, 최종 단계에서만 문자열로 변환
        ```js
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

        // 예:  1. 5 ETH를 $2000로 환산 (소수점 4자리)
            balanceWei = 1500000000000000000n  // 1.5 ETH
            coinPrice = 2000

            // Step 1: 가격 변환
            priceScaled = 20000000n  // 2000 * 10^4

            // Step 2: BigInt 곱셈 (정밀도 유지)
            num = 1500000000000000000n * 20000000n
                = 30000000000000000000000000n

            // Step 3: Wei → ETH 변환 + 반올림
            denom = 1000000000000000000n  // 10^18
            amountScaled = (30000000000000000000000000n + 500000000000000000n) / 1000000000000000000n = 30000n  // $3. 0000
        ```
        - 포맷팅 - 정수/소수 분리 후 locale 적용
        ```js
        export function formatFixedBigint(value: bigint, digits: number, locale?: string) {
            const sign = value < 0n ? "-" : "";
            const v = value < 0n ? -value : value;

            const base = 10n ** BigInt(digits);
            const intPart = v / base;
            const fracPart = v % base;

            const intFormatted = intPart.toLocaleString(locale);
            const fracStr = fracPart.toString().padStart(digits, "0");

            return digits > 0 ? `${sign}${intFormatted}.${fracStr}` : `${sign}${intFormatted}`;
        }

        // 입력: 30000n (스케일링된 $3.0000)
            value = 30000n
            digits = 4

            // Step 1: 분리 기준
            base = 10000n  // 10^4

            // Step 2: 정수부/소수부 계산
            intPart = 30000n / 10000n = 3n
            fracPart = 30000n % 10000n = 0n

            // Step 3: 문자열 변환
            intFormatted = "3"
            fracStr = "0000"  // padStart로 4자리 보장
            // 결과: "3.0000"
        ```


---

## 지원 네트워크(Chains)

- Sepolia (테스트넷)
- Ethereum Mainnet
- Polygon
- Base
- Optimism
- arbitrum

---

## 기술 스택

- **Next.js** (App Router)
- **TypeScript**
- **RainbowKit** (지갑 연결 UI)
- **wagmi v2** (EVM 리액트 훅/액션)
- **viem** (EVM RPC client)
- **Zustand** (주소록 상태 관리)
- **shadcn/ui + TailwindCSS** (UI)

---

## 프로젝트 구조(예시)
```markdown
project/
├─ app/
│  └─ (wallet)/                 # 지갑 도메인(라우트 그룹)
│     ├─ _components/            # page.tsx 전용 컴포넌트
│     ├─ _hooks/                 # page.tsx 전용 훅
│     ├─ _lib/                   # page.tsx 전용 라이브러리
│     ├─ _shared/                # (wallet) 내 여러 페이지에서 공용으로 쓰는 요소(공통 UI/로직)
│     ├─ address-book/           # 주소록 페이지(라우트)
│     │  └─ _components/         # 주소록 페이지 전용 컴포넌트
│     └─ explorer/               # 탐색기 페이지(라우트)
│        ├─ _components/         # 탐색기 페이지 전용 컴포넌트
│        └─ _lib/                # 탐색기 페이지 전용 유틸
├─ components/                   # 전역 공용 UI 컴포넌트(도메인 불문)
├─ hooks/                        # 전역 공용 훅
├─ lib/                          # 전역 공용 유틸/헬퍼
└─ store/                        # 전역 상태 관리(Zustand)
```

---

## 회고
짧은 사이드 프로젝트였지만, 첫 Web3 프로젝트였다. 구현하면서 자산 단위를 왜 BigInt로 다루는지(JS number 정밀도 한계와 오버플로우 방지) 이해했고, 노드와의 통신이 전형적인 REST 아키텍처 스타일보다 JSON-RPC 메서드 호출(eth_getBalance 등) 형태로 이뤄진다는 것도 자연스럽게 배웠다. 

가장 헤맸던 건 가스(수수료) 모델이었다. 코인 전송을 만들고 나서 트랜잭션이 오래 pending 상태에 머물면, EOA 특성상 nonce가 밀려 다음 트랜잭션까지 연쇄적으로 대기하는 문제가 생겼다. 

확인해 보니, 기본값으로 설정된 **maxFeePerGas가 당시 네트워크 baseFee보다 낮아 블록에 포함되기 어려운 수수료 조건**이 되는 케이스가 있었다. 이 문제는 **estimateFeesPerGas()** 로 블록 포함 가능성이 높은 수수료를 추정해 **maxFeePerGas/maxPriorityFeePerGas**를 명시적으로 넣는 방식으로 완화했다. 

그 과정에서 baseFee, maxPriorityFeePerGas, maxFeePerGas의 역할을 이해하게 됐다.

Explorer 페이지에서는 별도의 회원가입/로그인 없이도, **메시지 서명과 검증(signMessageAsync -> verifyMessage)** 으로 **본인 소유 주소**를 증명할 수 있다는 점이 새로웠다. 또한 주소는 단순 문자열이 아니라, **EOA 인지 컨트랙트인지** 에 따라 동작과 검증 방식이 달라진다는 것도 배웠다.

처음 접하는 개념이 많아 쉽진 않았지만, 매 단계에서 생긴 의문을 직접 확인하며 배워나갈 수 있어 오래 기억에 남을 사이드 프로젝트였다.

다음 단계로는, 노드(JSON-RPC)만으로는 주소별 트랜잭션 히스토리를 바로 얻기 어렵다는 점을 고려해, Explorer API(Etherscan/Blockscout 등) 연동으로 txList 조회 기능을 추가해보고 싶다.