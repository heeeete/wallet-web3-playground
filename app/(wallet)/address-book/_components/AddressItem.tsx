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

    const fieldBase = "h-9 w-full rounded-xl px-2 text-sm outline-none transition";
    const fieldView = "bg-transparent text-foreground/90";
    const fieldEdit = "bg-muted/20 ring-2 ring-primary/20 focus:ring-primary/30";

    const iconWrap =
        "inline-flex size-8 items-center justify-center rounded-xl bg-muted/30 text-muted-foreground";

    return (
        <div className="rounded-3xl border bg-background p-4 shadow-sm transition-colors hover:border-muted-foreground/30">
            <div className="flex items-start justify-between gap-3">
                <div className="flex w-full flex-col gap-2">
                    {/* 이름 */}
                    <div className="flex items-center gap-2">
                        <span className={iconWrap}>
                            <User className="size-4" />
                        </span>
                        <input
                            value={isEditing ? editName : name}
                            onChange={(e) => onEditNameChange(e.target.value)}
                            readOnly={!isEditing}
                            className={cn(fieldBase, isEditing ? fieldEdit : fieldView)}
                            placeholder="이름"
                        />
                    </div>

                    {/* 주소 */}
                    <div className="flex items-center gap-2">
                        <span className={iconWrap}>
                            <MapPinHouse className="size-4" />
                        </span>
                        <input
                            value={isEditing ? editAddress : address}
                            onChange={(e) => onEditAddressChange(e.target.value)}
                            readOnly={!isEditing}
                            className={cn(
                                fieldBase,
                                "font-mono text-[13px] tracking-tight truncate",
                                isEditing ? fieldEdit : fieldView
                            )}
                            placeholder="0x..."
                        />
                    </div>
                </div>

                <ButtonGroup>
                    <Button
                        onClick={handleSendClick}
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        title="보내기"
                    >
                        <Send className="size-4" />
                    </Button>

                    <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        title="주소 복사"
                    >
                        {copied ? (
                            <Check strokeWidth={3} className="size-4 animate-bounce" />
                        ) : (
                            <Copy className="size-4" />
                        )}
                    </Button>

                    <Button
                        onClick={isEditing ? onEditSave : onEditClick}
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        title={isEditing ? "저장" : "수정"}
                    >
                        {isEditing ? <Check className="size-4" /> : <Edit className="size-4" />}
                    </Button>

                    <Button
                        onClick={onRemove}
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        title="삭제"
                    >
                        <Trash className="size-4" />
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}
