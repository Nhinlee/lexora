"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UploadZone from "../../components/UploadZone";
import VocabularyCard from "../../components/VocabularyCard";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
import { ArrowLeft, ArrowRight, Book, Loader2, Search, X } from "lucide-react";

// ... (interfaces)

export default function BookView() {
    const params = useParams();
    const [book, setBook] = useState<BookData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const fetchBook = async () => {
        try {
            // In a real app, use React Query
            const res = await fetch(`http://localhost:3000/books/${params.id}`);
            if (!res.ok) throw new Error("Failed to fetch book");
            const data = await res.json();
            setBook(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchBook();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
                Book not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Book className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{book.title}</h1>
                            <p className="text-muted-foreground text-sm">{book.author}</p>
                        </div>
                    </div>
                </header>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Add New Page</h3>
                    <UploadZone bookId={book.id} onUploadComplete={fetchBook} />
                </div>

                {/* Search & Filter */}
                <div className="sticky top-4 z-20">
                    <div className="glass-panel p-4 rounded-xl flex items-center space-x-4 bg-card/50 backdrop-blur-xl border border-border shadow-xl">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by page location (e.g., '42 hrs', '15%')..."
                            className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground w-full"
                            onChange={(e) => {
                                const query = e.target.value.toLowerCase();
                                const queryDigits = query.replace(/\D/g, '');

                                const pages = document.querySelectorAll('[data-page-id]');
                                pages.forEach((page) => {
                                    const pageNum = page.getAttribute('data-page-num')?.toLowerCase() || '';
                                    const pageDigits = pageNum.replace(/\D/g, '');

                                    // Match exact text OR matched digits (for "4240" -> "42 hrs 40 mins" case)
                                    const isMatch = pageNum.includes(query) ||
                                        (queryDigits.length > 0 && pageDigits.includes(queryDigits));

                                    (page as HTMLElement).style.display = isMatch ? 'block' : 'none';
                                });
                            }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {book.pages.map((page) => (
                        <div
                            key={page.id}
                            className="space-y-6 scroll-mt-24"
                            data-page-id={page.id}
                            data-page-num={page.pageNumber}
                        >
                            {/* Page Header / Footer Style */}
                            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-card border border-border">
                                {(() => {
                                    const parts = page.pageNumber.split('|').map(s => s.trim());
                                    const leftText = parts[0];
                                    const rightText = parts.length > 1 ? parts[1] : '';

                                    return (
                                        <>
                                            <span className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                                                {leftText}
                                            </span>
                                            {rightText && (
                                                <span className="text-muted-foreground text-xs font-mono bg-secondary px-2 py-1 rounded">
                                                    {rightText}
                                                </span>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {page.vocabulary.map((vocab) => (
                                    <VocabularyCard
                                        key={vocab.id}
                                        word={vocab.word}
                                        definition={vocab.definition}
                                        context={vocab.contextSentence}
                                        imageUrl={vocab.imageUrl}
                                        masteryLevel={vocab.masteryLevel}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Floating Mobile Navigation */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-full max-w-[90%] flex justify-center pointer-events-none">
                    <div className={cn(
                        "flex items-center bg-slate-900/90 backdrop-blur-lg border border-slate-800 rounded-full shadow-2xl transition-all duration-300 ease-in-out overflow-hidden pointer-events-auto",
                        isMobileSearchOpen ? "w-full p-2" : "w-fit p-2 space-x-2"
                    )}>
                        {isMobileSearchOpen ? (
                            <div className="flex items-center w-full animate-in fade-in zoom-in duration-300">
                                <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search pages..."
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 h-10 min-w-0"
                                    onChange={(e) => {
                                        const query = e.target.value.toLowerCase();
                                        const queryDigits = query.replace(/\D/g, '');

                                        const pages = document.querySelectorAll('[data-page-id]');
                                        pages.forEach((page) => {
                                            const pageNum = page.getAttribute('data-page-num')?.toLowerCase() || '';
                                            const pageDigits = pageNum.replace(/\D/g, '');
                                            const isMatch = pageNum.includes(query) ||
                                                (queryDigits.length > 0 && pageDigits.includes(queryDigits));
                                            (page as HTMLElement).style.display = isMatch ? 'block' : 'none';
                                        });
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        setIsMobileSearchOpen(false);
                                        // Reset search
                                        const pages = document.querySelectorAll('[data-page-id]');
                                        pages.forEach((page) => (page as HTMLElement).style.display = 'block');
                                    }}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-2 flex-shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        const pages = Array.from(document.querySelectorAll('[data-page-id]'));
                                        const currentScroll = window.scrollY + 100;
                                        const currentIndex = pages.findIndex(p => (p as HTMLElement).offsetTop > currentScroll);
                                        const prevIndex = currentIndex === -1 ? pages.length - 2 : currentIndex - 1;

                                        if (prevIndex >= 0) {
                                            pages[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>

                                <div className="w-px h-6 bg-slate-800" />

                                <button
                                    onClick={() => setIsMobileSearchOpen(true)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/20"
                                >
                                    <Search className="w-4 h-4" />
                                    <span className="text-sm">Search</span>
                                </button>

                                <div className="w-px h-6 bg-slate-800" />

                                <button
                                    onClick={() => {
                                        const pages = Array.from(document.querySelectorAll('[data-page-id]'));
                                        const currentScroll = window.scrollY + 100;
                                        const nextIndex = pages.findIndex(p => (p as HTMLElement).offsetTop > currentScroll);

                                        if (nextIndex !== -1) {
                                            pages[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        } else if (pages.length > 0 && window.scrollY < (pages[0] as HTMLElement).offsetTop) {
                                            pages[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
