import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-4 h-header">
            <h1>
                <Link href="/" aria-label="Wallet">
                    <Image
                        src="/header-img.png"
                        alt="Wallet logo"
                        width={220}
                        height={80}
                        priority
                        className="h-auto"
                    />
                </Link>
            </h1>
            <ConnectButton />
        </header>
    );
}
