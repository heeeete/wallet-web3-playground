import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

interface RecipientFieldProps {
	field: ControllerRenderProps<
		{
			amount: number;
			recipient: string;
		},
		"recipient"
	>;
}

export function RecipientField({ field }: RecipientFieldProps) {
	return (
		<FormItem className="border p-4 rounded-3xl">
			<FormLabel>
				<div className="flex justify-between flex-1 items-center text-muted-foreground">
					<span className="text-lg font-semibold">Recipient</span>
				</div>
			</FormLabel>
			<FormControl>
				<Input value={field.value} onChange={field.onChange} placeholder="0x1cA...D152" />
			</FormControl>
			<FormMessage />
		</FormItem>
	);
}
