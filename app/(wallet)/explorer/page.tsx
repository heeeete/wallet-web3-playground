"use client";
import { useState } from "react";

import SearchForm from "./_components/SearchForm";
import { SearchResult } from "./type";

export default function ExplorerPage() {
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    console.log(searchResult);

    return (
        <div>
            <SearchForm setSearchResult={setSearchResult} />
        </div>
    );
}
