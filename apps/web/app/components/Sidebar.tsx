"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Layers, Plus, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "./ThemeToggle";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

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

    const SidebarContent = () => (
        <>
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
                            onClick={() => setIsMobileOpen(false)}
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
        </>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="text-primary">✦</span> Lexora
                </h1>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-muted-foreground hover:text-foreground"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 bg-card border-r border-border flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </div>
            )}
        </>
    );
}
