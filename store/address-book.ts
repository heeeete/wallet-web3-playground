import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddressBookStore {
	addressBook: Record<string, string>;
	addAddress: (name: string, address: string) => void;
	removeAddress: (name: string) => void;
	editAddress: (name: string, address: string) => void;
}

export const useAddressBookStore = create<AddressBookStore>()(
	persist(
		(set) => ({
			addressBook: {},

			addAddress: (name, address) =>
				set((state) => ({
					addressBook: { ...state.addressBook, [name]: address },
				})),

			removeAddress: (name) =>
				set((state) => {
					const { [name]: _, ...rest } = state.addressBook;
					return { addressBook: rest };
				}),
			editAddress: (name, address) =>
				set((state) => ({
					addressBook: { ...state.addressBook, [name]: address },
				})),
		}),
		{
			name: "address-book",
		}
	)
);
