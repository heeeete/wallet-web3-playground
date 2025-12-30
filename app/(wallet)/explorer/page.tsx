"use client";
import { useState } from "react";

import SearchForm from "./_components/SearchForm";
import SearchResult from "./_components/SearchResult";
import { SearchResultType } from "./type";

export default function ExplorerPage() {
    const [searchResult, setSearchResult] = useState<SearchResultType | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="h-full flex flex-col gap-4">
            <SearchForm
                isLoading={isLoading}
                setSearchResult={setSearchResult}
                setIsLoading={setIsLoading}
            />

            <SearchResult searchResult={searchResult} isLoading={isLoading} />
        </div>
    );
}
