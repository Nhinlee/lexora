"use client";

import { Volume2, BookOpen } from "lucide-react";
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
    return (
        <div className="h-[550px] w-full bg-card border border-border rounded-2xl overflow-hidden shadow-xl hover:border-primary/30 transition-colors flex flex-col relative group">
            {/* Background Image Effect */}
            {imageUrl && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/80" />
                </div>
            )}

            {/* Header - Fixed */}
            <div className="p-6 pb-2 relative z-10 flex-shrink-0">
                <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        B1 Level
                    </span>
                </div>
                <h3 className="text-3xl font-bold text-foreground tracking-tight">
                    {word}
                </h3>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 relative z-10 space-y-6">
                {/* Image */}
                {imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
                        <img
                            src={imageUrl}
                            alt={word}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {/* Definition */}
                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        Definition
                    </h4>
                    <p className="text-foreground leading-relaxed">
                        {definition}
                    </p>
                </div>

                {/* Context */}
                <div className="prose prose-sm dark:prose-invert">
                    <p className="text-muted-foreground italic font-serif text-lg leading-relaxed border-l-2 border-primary/30 pl-4 my-0">
                        "{context}"
                    </p>
                </div>

                {/* Bottom Padding for scroll */}
                <div className="h-4" />
            </div>

            {/* Footer - Fixed */}
            <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm relative z-10 flex-shrink-0">
                <button className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors w-full justify-center py-2 rounded-lg hover:bg-primary/5">
                    <Volume2 className="w-4 h-4" />
                    <span>Pronounce</span>
                </button>
            </div>
        </div>
    );
}
