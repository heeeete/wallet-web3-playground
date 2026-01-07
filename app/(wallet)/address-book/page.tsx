import AddressBookClient from "./_components/AddressBookClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Address Book",
    description: "Address Book",
};

export default function AddressBookPage() {
    return <AddressBookClient />;
}
