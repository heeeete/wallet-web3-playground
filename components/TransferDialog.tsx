import TransferForm from "./TransferForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function TransferDialog({ children }: { children: React.ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Transfer</DialogTitle>
				</DialogHeader>
				<TransferForm />
			</DialogContent>
		</Dialog>
	);
}
