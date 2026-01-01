import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { ControllerRenderProps } from "react-hook-form";

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { UiTxState } from "../_hooks/useTransactionState";

interface RecipientFieldProps {
    field: ControllerRenderProps<
        {
            amount: number;
            recipient: string;
        },
        "recipient"
    >;
    uiState: UiTxState;
}

export function RecipientField({ field, uiState }: RecipientFieldProps) {
    const searchParams = useSearchParams();
    const getAddress = searchParams.get("address");

    const isDisabled = uiState === "wallet" || uiState === "confirming";

    useEffect(() => {
        if (getAddress) field.onChange(getAddress);
    }, [getAddress, field]);

    return (
        <FormItem
            className={cn(
                "rounded-3xl border bg-background p-4 shadow-sm transition-colors",
                isDisabled ? "opacity-70" : "hover:border-muted-foreground"
            )}
        >
            <FormLabel className="block">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-semibold text-foreground">Recipient</span>
                </div>
            </FormLabel>

            <FormControl>
                <div className="mt-3">
                    <div
                        className={cn(
                            "flex items-center rounded-2xl border bg-muted/20 p-2 transition",
                            "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15"
                        )}
                    >
                        <Input
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            placeholder="0x1cA...D152"
                            disabled={isDisabled}
                            className={cn(
                                "h-11 border-0 bg-transparent",
                                "text-base font-medium",
                                "shadow-none focus-visible:ring-0"
                            )}
                        />
                    </div>
                </div>
            </FormControl>

            <FormMessage className="mt-2" />
        </FormItem>
    );
}
