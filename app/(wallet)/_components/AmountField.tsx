import { ControllerRenderProps } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AmountFieldProps {
    field: ControllerRenderProps<
        {
            amount: number;
            recipient: string;
        },
        "amount"
    >;
    maxAmount?: number;
}

export function AmountField({ field, maxAmount }: AmountFieldProps) {
    const handleMaxBtn = () => {
        if (maxAmount !== undefined) {
            field.onChange(maxAmount);
        }
    };

    return (
        <FormItem className="border p-4 rounded-3xl">
            <FormLabel>
                <div className="flex justify-between flex-1 items-center text-muted-foreground">
                    <span className="text-lg font-semibold">Amount</span>
                    {maxAmount !== undefined && <span>Balance: {maxAmount.toFixed(4)}</span>}
                </div>
            </FormLabel>
            <FormControl>
                <div className="flex items-center gap-2">
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
                    />
                    <Button
                        onClick={handleMaxBtn}
                        variant="outline"
                        type="button"
                        className="text-main font-semibold border-none"
                    >
                        MAX
                    </Button>
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
