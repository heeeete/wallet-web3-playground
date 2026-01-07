import { Metadata } from "next";
import HistoryClient from "./_components/HistoryClient";

export const metadata: Metadata = {
    title: "History",
    description: "History",
};

export default function HistoryPage() {
    return <HistoryClient />;
}
