import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<header className="flex items-center justify-between px-4 h-20">
			<h1>
				<Link href="/" aria-label="Wallet">
					<Image src="/logo.png" alt="Wallet logo" width={200} height={58} priority />
				</Link>
			</h1>
			<ConnectButton />
		</header>
	);
}
