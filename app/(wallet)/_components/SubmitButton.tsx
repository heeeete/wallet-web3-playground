import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type UiTxState = "idle" | "wallet" | "submitted" | "confirming" | "success" | "error";

interface SubmitButtonProps {
    uiState: UiTxState;
    isPending: boolean;
}

export function SubmitButton({ uiState, isPending }: SubmitButtonProps) {
    const isLoading = uiState === "wallet" || uiState === "confirming";

    const getButtonText = () => {
        switch (uiState) {
            case "wallet":
                return "지갑에서 확인 중...";
            case "confirming":
                return "확정 대기 중...";
            default:
                return "전송";
        }
    };

    return (
        <Button variant="submit" size="lg" type="submit" disabled={isPending}>
            {isLoading && <Spinner />}
            {getButtonText()}
        </Button>
    );
}
