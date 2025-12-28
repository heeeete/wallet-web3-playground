import { Input } from "@/components/ui/input";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
	return (
		<Input
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="여기에 입력해 검색하고 추가할 수 있어요."
			className="text-xl!"
		/>
	);
}
