import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletIcon } from "lucide-react";

export function NotConnected() {
    return (
        <div className="relative flex h-full items-center justify-center p-6">
            {/* 배경 */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-950" />
                <div className="absolute inset-0 orbit">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-64 w-64 -translate-y-40 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-400/10" />
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="h-64 w-64 translate-y-40 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-400/10" />
                    </div>
                </div>
            </div>

            <div className="relative w-full max-w-md rounded-2xl border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/50">
                <div className="flex items-start gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl border border-zinc-200/80 bg-zinc-50 text-zinc-900 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-50">
                        <WalletIcon className="size-6" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                            지갑 연결이 필요해요
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                            이 기능은 지갑을 연결한 사용자만 사용할 수 있어요. 연결 후 바로 진행할
                            수 있습니다.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <ConnectButton.Custom>
                        {({ openConnectModal, mounted }) => {
                            const ready = mounted;

                            return (
                                <button
                                    type="button"
                                    onClick={openConnectModal}
                                    disabled={!ready}
                                    className={[
                                        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold",
                                        "bg-zinc-900 text-white shadow-sm transition",
                                        "hover:bg-zinc-800 active:scale-[0.99]",
                                        "disabled:cursor-not-allowed disabled:opacity-60",
                                        "dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                                        "dark:focus-visible:ring-offset-zinc-950",
                                    ].join(" ")}
                                >
                                    <WalletIcon className="size-4" />
                                    지갑 연결하기
                                </button>
                            );
                        }}
                    </ConnectButton.Custom>
                </div>
            </div>
        </div>
    );
}
