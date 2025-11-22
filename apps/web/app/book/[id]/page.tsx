"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UploadZone from "../../components/UploadZone";
import VocabularyCard from "../../components/VocabularyCard";
import { ArrowLeft, Book, Loader2, Search } from "lucide-react";
import Link from "next/link";

interface Vocabulary {
    id: string;
    word: string;
    definition: string;
    contextSentence: string;
    imageUrl?: string;
    masteryLevel: number;
}

interface BookData {
    id: string;
    title: string;
    author: string;
    pages: {
        id: string;
        pageNumber: string;
        vocabulary: Vocabulary[];
    }[];
}

export default function BookView() {
    const params = useParams();
    const [book, setBook] = useState<BookData | null>(null);
    const [loading, setLoading] = useState(true);

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
            </div>
        </div>
    );
}
