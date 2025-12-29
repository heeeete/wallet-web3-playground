"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Nav() {
	const pathname = usePathname();

	return (
		<nav className="flex">
			{navItems.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						"flex-1 flex justify-center items-center h-[60px] text-2xl font-bold",
						pathname === item.href ? "text-primary" : "text-muted-foreground"
					)}
				>
					{item.label}
				</Link>
			))}
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
