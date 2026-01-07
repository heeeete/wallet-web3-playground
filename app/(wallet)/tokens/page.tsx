import { Metadata } from "next";
import TokensClient from "./_components/TokensClient";


export const metadata: Metadata = {
    title: "Tokens",
    description: "Tokens",
};

export default function TokensPage() {
    return <TokensClient />;
}
