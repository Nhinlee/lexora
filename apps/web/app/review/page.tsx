"use client";

import { useEffect, useState } from "react";
import VocabularyCard from "../components/VocabularyCard";
import { ArrowLeft, Loader2, Layers } from "lucide-react";
import Link from "next/link";

interface Vocabulary {
    id: string;
    word: string;
    definition: string;
    contextSentence: string;
    imageUrl?: string;
    masteryLevel: number;
}

export default function ReviewView() {
    const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchVocabulary = async () => {
            try {
                const res = await fetch("http://localhost:3000/vocabulary");
                if (!res.ok) throw new Error("Failed to fetch vocabulary");
                const data = await res.json();
                setVocabulary(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVocabulary();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (vocabulary.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 space-y-4">
                <p>No vocabulary saved yet.</p>
                <Link href="/" className="text-indigo-400 hover:underline">
                    Go upload a book page
                </Link>
            </div>
        );
    }

    const currentCard = vocabulary[currentIndex];

    return (
        <div className="min-h-screen bg-slate-950 p-8 flex flex-col">
            <header className="flex items-center justify-center max-w-4xl mx-auto w-full mb-12">
                <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span className="text-white font-medium">
                        Card {currentIndex + 1} / {vocabulary.length}
                    </span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full space-y-8">
                <VocabularyCard
                    key={currentCard.id}
                    word={currentCard.word}
                    definition={currentCard.definition}
                    context={currentCard.contextSentence}
                    imageUrl={currentCard.imageUrl}
                    masteryLevel={currentCard.masteryLevel}
                />

                <div className="flex items-center space-x-4 w-full">
                    <button
                        onClick={handlePrev}
                        className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Next Card
                    </button>
                </div>
            </main>
        </div>
    );
}
