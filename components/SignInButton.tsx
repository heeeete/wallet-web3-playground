"use client";

import { Button } from "@/components/ui/button";

type Props = {
	onSignIn: () => void;
	disabled?: boolean;
	isPending?: boolean;
	signedIn?: boolean;
};

export default function SignInButton({ onSignIn, disabled, isPending, signedIn }: Props) {
	return (
		<Button variant="outline" onClick={onSignIn} disabled={disabled || isPending || signedIn}>
			{isPending && "Signing..."}
			{!isPending && !signedIn && "서명하기"}
			{!isPending && signedIn && "서명완료"}
		</Button>
	);
}
