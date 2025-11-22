"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Layers, Plus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        {
            href: "/books",
            label: "My Books",
            icon: Book,
        },
        {
            href: "/review",
            label: "Flashcards",
            icon: Layers,
        },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-950 border-r border-slate-800 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-500">✦</span> Lexora
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400 font-medium"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                            )}
                        >
                            <link.icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">Demo User</p>
                        <p className="text-xs text-slate-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
