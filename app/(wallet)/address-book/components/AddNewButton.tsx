import { Button } from "@/components/ui/button";

interface AddNewButtonProps {
	keyword: string;
	onClick: () => void;
}

export function AddNewButton({ keyword, onClick }: AddNewButtonProps) {
	return (
		<Button onClick={onClick} variant="outline" className="mx-auto">
			<span className="font-semibold">{keyword}</span> 추가
		</Button>
	);
}
