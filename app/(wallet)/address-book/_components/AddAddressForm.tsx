import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddAddressFormProps {
	keyword: string;
	address: string;
	onAddressChange: (address: string) => void;
	onSubmit: () => void;
}

export function AddAddressForm({
	keyword,
	address,
	onAddressChange,
	onSubmit,
}: AddAddressFormProps) {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-sm text-muted-foreground">
				<strong>{keyword}</strong>의 주소를 입력하세요
			</p>
			<Input
				value={address}
				onChange={(e) => onAddressChange(e.target.value)}
				placeholder="주소를 입력하세요"
			/>
			<Button onClick={onSubmit} variant="submit" className="w-full" size={"lg"}>
				추가
			</Button>
		</div>
	);
}
