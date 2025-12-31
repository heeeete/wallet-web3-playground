import { AddressItem } from "./AddressItem";

interface AddressListProps {
    entries: [string, string][];
    editingOriginalName: string;
    editName: string;
    editAddress: string;
    onEditNameChange: (value: string) => void;
    onEditAddressChange: (value: string) => void;
    onEditClick: (name: string, address: string) => void;
    onEditSave: () => void;
    onRemove: (name: string) => void;
}

export function AddressList({
    entries,
    editingOriginalName,
    editName,
    editAddress,
    onEditNameChange,
    onEditAddressChange,
    onEditClick,
    onEditSave,
    onRemove,
}: AddressListProps) {
    if (entries.length === 0) {
        return (
            <div className="flex items-center justify-center  text-muted-foreground">
                등록된 주소가 없습니다
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 overflow-y-auto flex-1 pt-2">
            {entries
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([name, address]) => (
                    <AddressItem
                        key={name}
                        name={name}
                        address={address}
                        isEditing={editingOriginalName === name}
                        editName={editName}
                        editAddress={editAddress}
                        onEditNameChange={onEditNameChange}
                        onEditAddressChange={onEditAddressChange}
                        onEditClick={() => onEditClick(name, address)}
                        onEditSave={onEditSave}
                        onRemove={() => onRemove(name)}
                    />
                ))}
        </div>
    );
}
