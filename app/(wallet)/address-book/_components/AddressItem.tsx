import { useState } from "react";

import { cn } from "@/lib/utils";
import { Check, Copy, Edit, MapPinHouse, Send, Trash, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

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
    const [copied, setCopied] = useState(false);

    const handleSendClick = () => {
        router.push(`/?address=${encodeURIComponent(address)}`);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };
    return (
        <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1 w-full">
                <p className="flex items-center">
                    <span className="w-10 inline-block">
                        <User />
                    </span>
                    <input
                        value={isEditing ? editName : name}
                        onChange={(e) => onEditNameChange(e.target.value)}
                        readOnly={!isEditing}
                        className={cn(
                            "outline-none w-full truncate",
                            isEditing ? "ring-2 rounded-md px-1" : ""
                        )}
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
                        className={cn(
                            "outline-none w-full truncate",
                            isEditing ? "ring-2 rounded-md px-1" : ""
                        )}
                    />
                </p>
            </div>
            {/* <div className="flex gap-2"> */}
            <ButtonGroup>
                <Button onClick={handleSendClick} variant={"outline"} size="icon">
                    <Send />
                </Button>
                <Button onClick={handleCopy} variant={"outline"} size="icon">
                    {copied ? <Check strokeWidth={3} className="animate-bounce" /> : <Copy />}
                </Button>
                <Button
                    onClick={isEditing ? onEditSave : onEditClick}
                    variant={"outline"}
                    size="icon"
                >
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
