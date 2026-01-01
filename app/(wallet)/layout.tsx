import React from "react";

import { cn } from "@/lib/utils";

import InfoDialog from "@/components/InfoDialog";

import Nav from "./_shared/Nav";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center h-[calc(100dvh-var(--height-header))] ">
            <main className={cn("w-[550px] flex flex-col rounded-4xl  bg-card duration-300")}>
                <Nav />
                <section className="h-[550px] p-4 ">{children}</section>
            </main>
            <InfoDialog />
        </div>
    );
}
