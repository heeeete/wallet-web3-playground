# Wallet (Web3 Playground)

Next.js(App Router) + RainbowKit + wagmi/viem으로 만든 **간단한 Web3 지갑형 프론트엔드 사이드 프로젝트**입니다.  
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
    - **성공/실패**: receipt 기반 결과 표시
- Etherscan 트랜잭션 링크 제공
- 트랜잭션 무한 Pending 방지
    - wagmi 기본값 대신 **`viem estimateFeesPerGas`** 로 가스비 사전 산정

### 3) Address Book (Zustand)
<img width="1498" height="945" alt="localhost_3000_ (1)" src="https://github.com/user-attachments/assets/20efcdc4-2481-4234-963d-599c7a4341a8" />

- 자주 쓰는 주소를 저장/관리
- 주소록에서 `Send` 버튼 클릭 시 Transfer 화면으로 이동하면서 **주소 자동 채움**
    - 방식: `/?address=0x...` (URL 기반)

### 4) Explorer (Address Lookup)
<img width="1498" height="945" alt="localhost_3000_explorer" src="https://github.com/user-attachments/assets/9f498f78-0c28-459b-be53-908726f4f1ed" />
주소를 입력하면 아래 정보를 조회해 보여줍니다.

- **본인 확인 기능본인
<img width="1137" height="721" alt="image" src="https://github.com/user-attachments/assets/7e90f832-3ac5-489a-b11e-02ad18424a9c" />

    - `useWalletSignIn` 커스텀 훅으로 메시지 서명 + 검증
    - `signMessageAsync`로 지갑 서명 요청 → `verifyMessage`로 서명 검증
    - 조회 주소가 본인 소유임을 증명
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
- **wagmi v2** (React hooks + 지갑/체인 상태)
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
