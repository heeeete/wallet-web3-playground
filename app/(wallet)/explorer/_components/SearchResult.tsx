import { CpuIcon } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";

import { SearchResultType } from "../_lib/types";
import ResultGrid from "./ResultGrid";

export default function SearchResult({
    searchResult,
    isLoading,
}: {
    searchResult: SearchResultType | null;
    isLoading: boolean;
}) {
    if (isLoading) {
        return (
            <div className=" mt-20 flex justify-center items-center">
                <Spinner className="size-10" />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className=" mt-20 flex justify-center items-center">
                <Spinner className="size-10" />
            </div>
        );
    }

    return (
        <div className="overflow-y-auto flex-1">
            {searchResult && (
                <>
                    {searchResult.isContract ? (
                        <div className="flex flex-col items-center gap-5">
                            <p>
                                <CpuIcon className="size-10" />
                            </p>
                            <p className="font-bold">컨트렉트 주소입니다.</p>
                        </div>
                    ) : (
                        <ResultGrid searchResult={searchResult} />
                    )}
                </>
            )}
        </div>
    );
}
