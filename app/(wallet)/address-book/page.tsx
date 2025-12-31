"use client";

import { useState } from "react";

import { useAddressBookStore } from "@/store/address-book";
import { toast } from "sonner";

import { AddAddressForm } from "./_components/AddAddressForm";
import { AddNewButton } from "./_components/AddNewButton";
import { AddressList } from "./_components/AddressList";
import { SearchInput } from "./_components/SearchInput";

export default function AddressBookPage() {
    const [keyword, setKeyword] = useState("");
    const [address, setAddress] = useState("");
    const [mode, setMode] = useState<"add" | "search">("search");
    const [editingOriginalName, setEditingOriginalName] = useState("");
    const [editName, setEditName] = useState("");
    const [editAddress, setEditAddress] = useState("");
    const addressBookStore = useAddressBookStore();

    const handleSearchChange = (value: string) => {
        setMode("search");
        setEditingOriginalName("");
        setKeyword(value);
    };

    const handleAddButtonClick = () => {
        setMode("add");
    };

    const handleAdd = () => {
        addressBookStore.addAddress(keyword, address);
        setKeyword("");
        setAddress("");
        setMode("search");
        toast.success("주소가 추가되었습니다.");
    };

    const handleRemove = (name: string) => {
        addressBookStore.removeAddress(name);
    };

    const handleEditClick = (name: string, address: string) => {
        setEditingOriginalName(name);
        setEditName(name);
        setEditAddress(address);
    };

    const handleEditSave = () => {
        if (editName !== editingOriginalName && addressBookStore.addressBook[editName]) {
            toast.error("이미 존재하는 주소입니다.");
            return;
        }
        if (editingOriginalName !== editName) {
            addressBookStore.removeAddress(editingOriginalName);
        }
        addressBookStore.addAddress(editName, editAddress);
        setEditingOriginalName("");
        setEditName("");
        setEditAddress("");
    };

    const filteredEntries = Object.entries(addressBookStore.addressBook).filter(([name]) =>
        keyword.length > 0 ? name.includes(keyword) : true
    );

    const showAddButton =
        keyword.length > 0 && mode === "search" && !addressBookStore.addressBook[keyword];

    return (
        <div className="flex flex-col gap-4 h-full">
            <SearchInput value={keyword} onChange={handleSearchChange} />

            {showAddButton && <AddNewButton keyword={keyword} onClick={handleAddButtonClick} />}

            {mode === "add" && (
                <AddAddressForm
                    keyword={keyword}
                    address={address}
                    onAddressChange={setAddress}
                    onSubmit={handleAdd}
                />
            )}

            <AddressList
                entries={filteredEntries}
                editingOriginalName={editingOriginalName}
                editName={editName}
                editAddress={editAddress}
                onEditNameChange={setEditName}
                onEditAddressChange={setEditAddress}
                onEditClick={handleEditClick}
                onEditSave={handleEditSave}
                onRemove={handleRemove}
            />
        </div>
    );
}
