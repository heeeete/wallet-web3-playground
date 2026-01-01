import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletIcon } from "lucide-react";

export function NotConnected() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 h-full">
            <p>
                <WalletIcon className="size-10" />
            </p>
            <p className="font-semibold">해당 기능은 지갑을 연결해야 사용할 수 있어요!</p>
            <ConnectButton />
        </div>
    );
}
