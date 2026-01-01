"use client";

import { useState } from "react";

import { AlertTriangle, ArrowUpRight, FlaskConical, Info } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function InfoDialog() {
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10">
                            <Info className="size-5 text-primary" />
                        </span>
                        <DialogTitle className="text-lg">안내</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm leading-relaxed">
                        방문해주셔서 감사합니다. 이 사이트는{" "}
                        <span className="font-medium">데모 환경</span>입니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 size-5 text-amber-600" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium">실제 사용 시 주의해주세요</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    데모 특성상 테스트 자산을 사용하고, 실사용 자산/메인넷 이용은
                                    권장하지 않습니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary">
                                <FlaskConical className="size-4" />
                            </span>
                            Sepolia 체인 사용을 추천드립니다
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            테스트용 ETH는 아래 링크에서 받을 수 있습니다.
                        </p>
                    </div>

                    <Button asChild className="w-full h-11">
                        <Link
                            href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                        >
                            테스트 ETH 받기
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        외부 사이트로 이동합니다.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
