import { Button } from "@/components/ui/button";
import { Check, Edit, MapPinHouse, Send, Trash, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";
import { useRouter } from "next/navigation";

interface AddressItemProps {
	name: string;
	address: string;
	isEditing: boolean;
	editName: string;
	editAddress: string;
	onEditNameChange: (value: string) => void;
	onEditAddressChange: (value: string) => void;
	onEditClick: () => void;
	onEditSave: () => void;
	onRemove: () => void;
}

export function AddressItem({
	name,
	address,
	isEditing,
	editName,
	editAddress,
	onEditNameChange,
	onEditAddressChange,
	onEditClick,
	onEditSave,
	onRemove,
}: AddressItemProps) {
	const router = useRouter();
	const handleSendClick = () => {
		router.push(`/?address=${encodeURIComponent(address)}`);
	};
	return (
		<div className="flex justify-between items-center">
			<div className="flex flex-col gap-1 w-full">
				<p className="flex items-center">
					<span className="w-10 inline-block">
						<User />
					</span>
					<input
						value={isEditing ? editName : name}
						onChange={(e) => onEditNameChange(e.target.value)}
						readOnly={!isEditing}
						className={cn("outline-none w-full", isEditing ? "ring-2 rounded-md px-1" : "")}
					/>
				</p>
				<p className="flex items-center">
					<span className="w-10 inline-block">
						<MapPinHouse />
					</span>
					<input
						value={isEditing ? editAddress : address}
						onChange={(e) => onEditAddressChange(e.target.value)}
						readOnly={!isEditing}
						className={cn("outline-none w-full", isEditing ? "ring-2 rounded-md px-1" : "")}
					/>
				</p>
			</div>
			{/* <div className="flex gap-2"> */}
			<ButtonGroup>
				<Button onClick={handleSendClick} variant={"outline"} size="icon">
					{<Send />}
				</Button>
				<Button onClick={isEditing ? onEditSave : onEditClick} variant={"outline"} size="icon">
					{isEditing ? <Check /> : <Edit />}
				</Button>
				<Button onClick={onRemove} variant={"outline"} size="icon">
					<Trash />
				</Button>
			</ButtonGroup>
			{/* </div> */}
		</div>
	);
}
