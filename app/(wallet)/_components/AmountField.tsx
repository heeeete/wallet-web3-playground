import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { UiTxState } from "../_hooks/useTransactionState";

interface AmountFieldProps {
    field: ControllerRenderProps<
        {
            amount: number;
            recipient: string;
        },
        "amount"
    >;
    maxAmount?: number;
    uiState: UiTxState;
}

export function AmountField({ field, maxAmount, uiState }: AmountFieldProps) {
    const isDisabled = uiState === "wallet" || uiState === "confirming";

    const handleMaxBtn = () => {
        if (maxAmount !== undefined) field.onChange(maxAmount);
    };

    return (
        <FormItem
            className={cn(
                "rounded-3xl border bg-background p-4 shadow-sm transition-colors",
                isDisabled ? "opacity-70" : "hover:border-muted-foreground"
            )}
        >
            <FormLabel className="block">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-foreground">Amount</span>
                    </div>

                    {maxAmount !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Wallet className="size-3.5" />
                            <span>Balance</span>
                            <span className="font-medium ">{maxAmount.toFixed(4)}</span>
                        </div>
                    )}
                </div>
            </FormLabel>

            <FormControl>
                <div className="mt-3">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-2xl border bg-muted/20 p-2 transition",
                            "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15"
                        )}
                    >
                        <Input
                            type="number"
                            step="0.0001"
                            max={maxAmount}
                            value={field.value ?? ""}
                            onChange={(e) =>
                                field.onChange(
                                    e.target.value === "" ? undefined : Number(e.target.value)
                                )
                            }
                            placeholder="0.0001"
                            disabled={isDisabled}
                            className={cn(
                                "h-11 border-0 bg-transparent",
                                "text-base font-medium ",
                                "shadow-none focus-visible:ring-0"
                            )}
                        />

                        <Button
                            onClick={handleMaxBtn}
                            type="button"
                            variant="secondary"
                            disabled={isDisabled || maxAmount === undefined}
                            className="h-10 rounded-xl px-4 font-semibold"
                        >
                            MAX
                        </Button>
                    </div>
                </div>
            </FormControl>

            <FormMessage className="mt-2" />
        </FormItem>
    );
}
