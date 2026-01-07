import { Metadata } from "next";
import ExplorerClient from "./_components/ExplorerClient";

export const metadata: Metadata = {
    title: "Explorer",
    description: "Explorer",
};

export default function ExplorerPage() {
    return <ExplorerClient />;
}
