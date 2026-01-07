# Wallet (Web3 Playground)

🔗 **Live Demo**: https://wallet-web3-playground.vercel.app

Next.js(App Router) + RainbowKit + wagmi/viem으로 만든 Web3 지갑 dApp입니다.
**지갑 연결, 코인 전송, 주소록, 주소/컨트랙트 탐색(Explorer)** 기능을 구현했습니다.

---

## ✨ 주요 기능

### 1️⃣ Wallet Connect

- RainbowKit `ConnectButton`으로 지갑 연결
- 연결 상태(주소, 체인) 기반으로 화면/기능 활성화

### 2️⃣ Send (가상자산 전송)

<img width="1498" alt="Send Transaction UI" src="https://github.com/user-attachments/assets/1c7ed760-1752-40ce-852b-9e3f1769ff45" />

**기능:**
- 수신자 주소 + 금액 입력 후 트랜잭션 전송
- 전송 상태 UX 분리:
  - **Pending**: 지갑에서 서명/승인 대기
  - **Confirming**: 블록에 포함될 때까지 대기
  - **Success/Failed**: wagmi 트랜잭션 상태 기반 결과 표시
- 각 체인의 트랜잭션 조회 링크 제공

**트랜잭션 무한 Pending 방지:**
- wagmi 기본값 대신 **`viem estimateFeesPerGas`** 로 가스비 사전 산정
- `maxFeePerGas`가 네트워크 `baseFee`보다 낮아 블록에 포함되지 않는 문제 해결

### 3️⃣ Address Book

<img width="1498" alt="Address Book UI" src="https://github.com/user-attachments/assets/20efcdc4-2481-4234-963d-599c7a4341a8" />

**기능:**
- Zustand 기반 주소록 상태 관리
- 자주 쓰는 주소를 저장/관리
- 주소록에서 `Send` 버튼 클릭 시 Transfer 화면으로 이동하면서 주소 자동 채움
  - 방식:  URL 파라미터 `/?address=0x...`

### 4️⃣ Explorer (Address Lookup)

<img width="1498" alt="Explorer UI" src="https://github.com/user-attachments/assets/9f498f78-0c28-459b-be53-908726f4f1ed" />

주소를 입력하면 해당 주소의 정보를 조회합니다.

**본인 확인 기능:**

<img width="500" alt="Wallet Sign In" src="https://github.com/user-attachments/assets/7e90f832-3ac5-489a-b11e-02ad18424a9c" />

- `useWalletSignIn` 커스텀 훅으로 메시지 서명 + 검증
- `signMessageAsync`로 지갑 서명 요청 → `verifyMessage`로 서명 검증
- 조회 주소가 본인 소유임을 증명 (별도 회원가입/로그인 불필요)

**조회 정보:**
- **EOA / Contract 구분**
  - `publicClient. getCode({ address })`
  - `code`가 존재하면 Contract, 없으면 EOA
- **잔고 조회**
  - `publicClient.getBalance({ address, chainId })`
- **트랜잭션 횟수(Nonce)**
  - `publicClient.getTransactionCount({ address })`
- **원화(KRW) / USDT 환산 표시**
  - 코인 시세:  업비트 Ticker API → `getCoinPrice()`
  - BigInt 기반 고정소수점 연산으로 부동소수점 오류 방지

###  5️⃣ History (Etherscan API)

<img width="1728" height="991" alt="image" src="https://github.com/user-attachments/assets/9b274c2c-5224-4208-9496-df575d0edcb4" />

- **사용자의 트랜잭션 내역**을 Etherscan API를 통해 조회하여 표시
- **지원 체인**:
  - Sepolia (테스트넷)
  - Ethereum Mainnet
  - Polygon
  - Arbitrum
  - OP Mainnet, Base는 현재 미지원
- **주요 기능**:
  - 연결된 지갑 주소와 체인 ID를 기반으로 자동 조회
  - 트랜잭션을 최신순으로 정렬하여 표시
  - 각 트랜잭션 항목에서 다음 정보 제공:
    - 트랜잭션 해시 (클릭 시 해당 체인 explorer로 이동)
    - 전송 금액 (ETH, MATIC 등 네이티브 토큰)
    - 가스 비용 계산 (gasUsed × gasPrice)
    - 발신/수신 주소
    - 트랜잭션 시간 (YYYY-MM-DD HH: mm:ss 형식)
    - 성공/실패 상태 (isError와 txreceipt_status 기반)
- **UX 처리**:
  - 로딩 상태:  Spinner 표시
  - 에러 상태: 에러 메시지 표시
  - 빈 내역: "트랜잭션 내역이 없습니다" 안내
  - 미지원 체인:  "해당 체인은 지원하지 않습니다" 안내
- **API Route**:
  - `/api/chains/ethereum/transactions` — Etherscan API v2 연동 (서버 측 호출)
  - React Query를 통한 효율적인 데이터 캐싱 (staleTime: 5초)
- **접근성**:
  - 각 트랜잭션 항목에 적절한 ARIA 레이블 적용
  - 스크린 리더 지원 (sr-only 텍스트)

---

## 🔧 기술적 문제 해결

### 1️⃣ 배포 후 Upbit API CORS 에러

**문제:**
```
Access to fetch at 'https://api.upbit.com/v1/ticker? markets=KRW-ETH' has been blocked by CORS policy
GET https://api.upbit.com/v1/ticker?markets=KRW-ETH net:: ERR_FAILED 429 (Too Many Requests)
```

**원인:**
- CORS 차단과 429 응답 동시 발생
- 헤더 확인 결과 오리진마다 요청 제한 존재 (`limit-by-origin:  yes`)

**해결:**

1. **Next.js API Route로 프록시**
   - 브라우저에서 직접 호출 대신 API Route(`/api/coin-price`)에서 서버 사이드로 호출
   - CORS는 브라우저 정책이므로 서버에서는 제약 없음

2. **API 호출 횟수 최적화**
   - 기존:  `KRW-ETH`, `USDT-ETH` 각각 호출 (2번)
   - 개선: `?markets=KRW-ETH,USDT-ETH` 한 번에 조회

### 2️⃣ 잔액 환산 시 정밀도 손실 문제

**문제:**
```typescript
// ❌ Number 변환으로 정밀도 손실
const value = price * Number(formatEther(balance));
// 9007199254740991 이상 값에서 일부 자릿수가 0으로 표시됨
```

**원인:**
- JavaScript Number는 부동소수점 방식으로 큰 값의 정밀도 보장 불가

**해결:  BigInt 기반 고정소수점 연산**

```typescript
export function calculateBalanceValue(
  coinPrice: number,
  balanceWei: bigint,
  digits = 4,
  locale?:  string
): string {
  const WEI_DECIMALS = 18n;
  const priceScaled = parseUnits(coinPrice.toString(), digits);

  const denom = 10n ** WEI_DECIMALS;
  const num = balanceWei * priceScaled;
  const amountScaled = (num + denom / 2n) / denom;

  return formatFixedBigint(amountScaled, digits, locale);
}
```

**계산 예시**
```
balanceWei = 1500000000000000000n  // 1.5 ETH
coinPrice = 2000

// 1): 가격 스케일링
priceScaled = 20000000n  // 2000 * 10^4

// 2): BigInt 곱셈 (정밀도 유지)
num = 1500000000000000000n * 20000000n
    = 30000000000000000000000000n

// 3): Wei → ETH 변환 + 반올림
denom = 1000000000000000000n  // 10^18
amountScaled = (num + denom/2) / denom = 30000n

// 4): 포맷팅
formatFixedBigint(30000n, 4) = "3.0000"
```

**포맷팅 함수:**
```typescript
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
```

---

## 🔬 성능 실험

### 1️⃣ npm / pnpm 벤치마크 결과


Vercel 배포 시 설치 단계가 생각보다 오래 걸려서, 패키지 매니저(npm vs pnpm)에 따른 **의존성 설치/빌드 시간** 차이가 얼마나 나는지 간단히 비교했다.
(런타임 성능이 아니라 개발/배포 파이프라인 관점의 성능 비교)

> 측정 도구: `hyperfine`

### 성능 비교 요약 (설치/빌드 시간)

| 항목 | npm | pnpm | 결과 |
|---|---:|---:|---|
| `node_modules` 삭제 후 설치 | 32.080s ± 0.465 | 16.308s ± 0.380 | **pnpm이 15.772s 빠름** (**-49.2%**, **1.97×**) |
| 캐시/스토어 정리까지 포함 후 설치 | 33.005s ± 1.256 | 41.173s ± 5.427 | pnpm이 8.168s 느림 (**+24.7%**) ※ `pnpm store prune` 포함 |
| 빌드 (`next build`) | 10.715s ± 0.169 | 11.813s ± 0.169 | pnpm이 1.098s 느림 (**+10.2%**) |

### 측정 커맨드

```bash
# 1) node_modules 삭제 후 설치 (클린 설치)
hyperfine --warmup 1 --runs 10 'rm -rf node_modules && npm ci'
hyperfine --warmup 1 --runs 10 'rm -rf node_modules && pnpm install --frozen-lockfile'

# 2) 캐시/스토어 정리까지 포함 후 설치 (완전 초기화에 가까운 설치)
hyperfine --warmup 1 --runs 5 'rm -rf node_modules && npm cache clean --force && npm ci'
hyperfine --warmup 1 --runs 5 'rm -rf node_modules && pnpm store prune && pnpm install --frozen-lockfile'

# 3) 빌드
hyperfine --warmup 1 --runs 10 'npm run build'
hyperfine --warmup 1 --runs 10 'pnpm run build'
```

### 메모 (측정 신뢰도)

>측정은 같은 환경에서 순차 실행했지만, npm 측정을 먼저 끝내고 pnpm을 후반에 측정했음. 따라서 후반(pnpm) 결과가 발열/스로틀링/백그라운드 작업 영향을 더 받았을 가능성이 있어, 본 결과는 “완벽히 통제된 실험”이라기보단 대략적인 비교로 보는 게 안전함.

>“캐시/스토어 정리까지 포함 후 설치”는 순수 설치 시간만 비교한 게 아니라 npm cache clean / pnpm store prune 같은 정리 작업 시간까지 포함한 총 시간이라, 특히 pnpm 쪽이 불리하게 보일 수 있음.

---
## 🌐 지원 네트워크

- Sepolia (테스트넷)
- Ethereum Mainnet
- Polygon
- Base
- Optimism
- Arbitrum

---

## 🛠️ 기술 스택

| Category | Stack |
|----------|-------|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript 5 |
| **Web3** | RainbowKit 2.2, wagmi 2.19, viem 2.43 |
| **State** | Zustand 5.0 |
| **UI** | shadcn/ui, Tailwind CSS 4, Radix UI |
| **Form** | React Hook Form 7.69, Zod 4.2 |

---

## 📁 프로젝트 구조

```
wallet-web3-playground/
├── app/
│   ├── (wallet)/                # 지갑 도메인 (라우트 그룹)
│   │   ├── _components/         # 페이지 전용 컴포넌트
│   │   ├── _hooks/              # 페이지 전용 훅
│   │   ├── _lib/                # 페이지 전용 라이브러리
│   │   ├── _shared/             # (wallet) 내 공용 요소
│   │   ├── address-book/        # 주소록 페이지
│   │   │   └── _components/
│   │   └── explorer/            # 탐색기 페이지
│   │       ├── _components/
│   │       └── _lib/
│   ├── api/                     # API Routes
│   │   └── coin-price/          # Upbit API 프록시
│   ├── layout.tsx
│   ├── providers.tsx            # RainbowKit, wagmi 설정
│   └── globals.css
├── components/                  # 전역 공용 UI 컴포넌트
├── hooks/                       # 전역 공용 훅
│   └── useWalletSignIn.ts       # 지갑 서명/검증 훅
├── lib/                         # 전역 공용 유틸/헬퍼
├── store/                       # Zustand 스토어
│   └── address-book.ts          # 주소록 상태 관리
└── package.json
```

---

## 회고
짧은 사이드 프로젝트였지만, 첫 Web3 프로젝트였다. 구현하면서 자산 단위를 왜 BigInt로 다루는지(JS number 정밀도 한계와 오버플로우 방지) 이해했고, 노드와의 통신이 전형적인 REST 아키텍처 스타일보다 JSON-RPC 메서드 호출(eth_getBalance 등) 형태로 이뤄진다는 것도 자연스럽게 배웠다.

가장 헤맸던 건 가스(수수료) 모델이었다. 코인 전송을 만들고 나서 트랜잭션이 오래 pending 상태에 머물면, EOA 특성상 nonce가 밀려 다음 트랜잭션까지 연쇄적으로 대기하는 문제가 생겼다.

확인해 보니, 기본값으로 설정된 **maxFeePerGas가 당시 네트워크 baseFee보다 낮아 블록에 포함되기 어려운 수수료 조건**이 되는 케이스가 있었다. 이 문제는 **estimateFeesPerGas()** 로 블록 포함 가능성이 높은 수수료를 추정해 **maxFeePerGas/maxPriorityFeePerGas**를 명시적으로 넣는 방식으로 완화했다.

그 과정에서 baseFee, maxPriorityFeePerGas, maxFeePerGas의 역할을 이해하게 됐다.

Explorer 페이지에서는 별도의 회원가입/로그인 없이도, **메시지 서명과 검증(signMessageAsync -> verifyMessage)** 으로 **본인 소유 주소**를 증명할 수 있다는 점이 새로웠다. 또한 주소는 단순 문자열이 아니라, **EOA 인지 컨트랙트인지** 에 따라 동작과 검증 방식이 달라진다는 것도 배웠다.

처음 접하는 개념이 많아 쉽진 않았지만, 매 단계에서 생긴 의문을 직접 확인하며 배워나갈 수 있어 오래 기억에 남을 사이드 프로젝트였다.

앞으로 블록체인을 공부하면서 이 프로젝트도 계속 업데이트해나가야겠다.
