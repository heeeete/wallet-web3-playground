import { Metadata } from "next";
import WalletClient from "./_components/WalletClient";

export const metadata: Metadata = {
    title: "Send",
    description: "Send",
};

export default function WalletPage() {
    return (
            <WalletClient />
    );
}
