# Wallet (Web3 Playground)

Next.js(App Router) + RainbowKit + wagmi/viem으로 만든 **간단한 Web3 지갑형 프론트엔드 사이드 프로젝트**입니다.  
지갑 연결, ETH 전송, 주소록, 주소/컨트랙트 탐색(Explorer) 기능을 빠르게 구현해 **Web3 UX + 클라이언트 상태/네트워크 처리 역량**을 보여주는 것을 목표로 했습니다.

---

## 주요 기능

### 1) Wallet Connect

- RainbowKit `ConnectButton`으로 지갑 연결
- 연결 상태(주소, 체인) 기반으로 화면/기능 활성화

### 2) Send (가상자산 전송)

- 수신자 주소 + 금액 입력 후 트랜잭션 전송
- 전송 상태 UX 분리
    - **요청(pending)**: 지갑에서 서명/승인 대기
    - **컨펌(confirming)**: 체인 포함(채굴/확정) 대기
    - **성공/실패**: receipt 기반 결과 표시
- Etherscan 트랜잭션 링크 제공

### 3) Address Book (Zustand)

- 자주 쓰는 주소를 저장/관리
- 주소록에서 `Send` 버튼 클릭 시 Transfer 화면으로 이동하면서 **주소 자동 채움**
    - 방식: `/?address=0x...` (URL 기반)

### 4) Explorer (Address Lookup)

주소를 입력하면 아래 정보를 조회해 보여줍니다.

- **본인 확인 기능**
    - `useWalletSignIn` 훅으로 메시지 서명 + 검증
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
