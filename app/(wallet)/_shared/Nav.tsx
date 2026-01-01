"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
    const pathname = usePathname();

    return (
        <nav className="flex w-full rounded-3xl border bg-card p-1 shadow-sm scale-[102%]">
            {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex-1 rounded-2xl px-3 py-3 text-center text-base font-semibold transition-colors",
                            "hover:bg-background/70",
                            active
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground"
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

const navItems = [
    {
        label: "Send",
        href: "/",
    },
    {
        label: "Book",
        href: "/address-book",
    },
    {
        label: "Explorer",
        href: "/explorer",
    },
];
