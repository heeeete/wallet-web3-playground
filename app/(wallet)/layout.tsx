import React from "react";
import Link from "next/link";
import Nav from "./components/layouts/Nav";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex justify-center items-center h-[calc(100dvh-var(--height-header))] ">
			<main className="w-[500px]   flex flex-col rounded-4xl overflow-hidden bg-card">
				<Nav />
				<section className="h-[500px] p-4">{children}</section>
			</main>
		</div>
	);
}
