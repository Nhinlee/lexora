"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Layers, Plus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "./ThemeToggle";

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
        <aside className="w-64 h-screen fixed left-0 top-0 bg-card border-r border-border flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <span className="text-primary">✦</span> Lexora
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
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <link.icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Demo User</p>
                            <p className="text-xs text-muted-foreground">Free Plan</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}
