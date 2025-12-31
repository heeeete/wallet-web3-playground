"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import Nav from "./_shared/Nav";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex justify-center items-center h-[calc(100dvh-var(--height-header))] ">
            <main
                className={cn(
                    "w-[550px] flex flex-col rounded-4xl overflow-hidden bg-card duration-300",
                    pathname === "/address-book" ? "w-[600px]" : ""
                )}
            >
                <Nav />
                <section className="h-[550px] p-4">{children}</section>
            </main>
        </div>
    );
}
