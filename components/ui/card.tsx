import * as React from "react";

import { cn } from "@/lib/utils";

function MyCard({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "rounded-3xl border bg-background p-4 shadow-sm transition-colors hover:border-muted-foreground/30 relative",
                className
            )}
            {...props}
        />
    );
}

export { MyCard };
