import Image from "next/image";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "viem/chains";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const chains = [
    {
        id: mainnet.id,
        name: "Ethereum",
        logo: "/chain-logo/ethereum.svg",
    },
    {
        id: sepolia.id,
        name: "Sepolia",
        logo: "/chain-logo/ethereum.svg",
    },
    {
        id: polygon.id,
        name: "Polygon",
        logo: "/chain-logo/polygon.svg",
    },
    {
        id: base.id,
        name: "Base",
        logo: "/chain-logo/base.svg",
    },
    {
        id: optimism.id,
        name: "Optimism",
        logo: "/chain-logo/optimism.svg",
    },
    {
        id: arbitrum.id,
        name: "Arbitrum",
        logo: "/chain-logo/arbitrum.svg",
    },
];

export default function ChainSelect({
    selectedChainId,
    setSelectedChainId,
}: {
    selectedChainId: number;
    setSelectedChainId: React.Dispatch<React.SetStateAction<number>>;
}) {
    const selectedChain = chains.find((chain) => chain.id === selectedChainId);

    return (
        <Select
            value={selectedChainId.toString()}
            onValueChange={(value) => setSelectedChainId(Number(value))}
        >
            <SelectTrigger className="border-none bg-transparent! ring-0! outline-none shadow-none">
                <SelectValue>
                    {selectedChain && (
                        <div className="flex items-center gap-2">
                            <Image
                                src={selectedChain.logo}
                                alt={selectedChain.name}
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                        </div>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {chains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id.toString()}>
                        <div className="flex items-center gap-2">
                            <Image
                                src={chain.logo}
                                alt={chain.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className="font-semibold">{chain.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
