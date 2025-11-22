"use client";

import { useState } from "react";
import { Volume2, Search, BookOpen } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface VocabularyCardProps {
    word: string;
    definition: string;
    context: string;
    imageUrl?: string | null;
    masteryLevel?: number;
}

export default function VocabularyCard({
    word,
    definition,
    context,
    imageUrl,
    masteryLevel = 0,
}: VocabularyCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="group relative h-[400px] w-full perspective-1000">
            <div
                className={cn(
                    "relative h-full w-full transition-all duration-500 preserve-3d",
                    isFlipped ? "rotate-y-180" : ""
                )}
            >
                {/* Front of Card */}
                <div className="absolute inset-0 h-full w-full backface-hidden">
                    <div className="h-full w-full bg-card border border-border rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group-hover:border-primary/30 transition-colors shadow-xl">
                        {/* Image Background Gradient */}
                        {imageUrl && (
                            <div className="absolute inset-0 opacity-20 dark:opacity-30">
                                <img
                                    src={imageUrl}
                                    alt={word}
                                    className="w-full h-full object-cover mask-image-gradient"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                            </div>
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                    B1 Level
                                </span>
                                <button
                                    onClick={() => setIsFlipped(true)}
                                    className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                                {word}
                            </h3>
                            <p className="text-muted-foreground italic font-serif leading-relaxed">
                                "{context}"
                            </p>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <button className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors">
                                <Volume2 className="w-4 h-4" />
                                <span>Pronounce</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 h-full w-full backface-hidden rotate-y-180">
                    <div className="h-full w-full bg-card border border-border rounded-2xl p-6 flex flex-col shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-foreground">{word}</h3>
                            <button
                                onClick={() => setIsFlipped(false)}
                                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <BookOpen className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Definition
                                </h4>
                                <p className="text-foreground leading-relaxed">
                                    {definition}
                                </p>
                            </div>

                            {imageUrl && (
                                <div className="rounded-xl overflow-hidden border border-border">
                                    <img
                                        src={imageUrl}
                                        alt={word}
                                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
