"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VocabularyCard from "../../components/VocabularyCard";
import { ArrowLeft, Book, Loader2 } from "lucide-react";
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

    useEffect(() => {
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
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Upload</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-500/10 rounded-full">
                            <Book className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{book.title}</h1>
                            <p className="text-slate-400 text-sm">{book.author}</p>
                        </div>
                    </div>

                    <div className="w-24" /> {/* Spacer for alignment */}
                </header>

                {/* Content */}
                <div className="space-y-12">
                    {book.pages.map((page) => (
                        <div key={page.id} className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-px flex-1 bg-slate-800" />
                                <span className="text-slate-500 font-medium uppercase tracking-wider text-sm">
                                    {page.pageNumber}
                                </span>
                                <div className="h-px flex-1 bg-slate-800" />
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
