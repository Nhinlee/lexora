"use client";

import { useState, useCallback } from "react";
import { Upload, File, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface UploadZoneProps {
    bookId?: string;
    onUploadComplete?: () => void;
}

export default function UploadZone({ bookId, onUploadComplete }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    }, [bookId, onUploadComplete]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
        }
    }, [bookId, onUploadComplete]);

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file.");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        if (bookId) {
            formData.append("bookId", bookId);
        }

        try {
            const response = await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            // Navigate to book view with the new page entry
            // For now, we'll just log it and maybe show success
            console.log("Upload success:", data);
            // Assuming the backend returns { pageEntry: { bookId: ... } }
            // We might want to redirect to /book/[id]
            if (onUploadComplete) {
                onUploadComplete();
            } else if (data.pageEntry && data.pageEntry.bookId) {
                router.push(`/book/${data.pageEntry.bookId}`);
            }

        } catch (err) {
            console.error(err);
            setError("Failed to process image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative group cursor-pointer transition-all duration-300 ease-in-out",
                    "border-2 border-dashed rounded-3xl p-12 text-center",
                    "bg-slate-900/50 backdrop-blur-sm",
                    isDragging
                        ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
                        : "border-slate-700 hover:border-indigo-400/50 hover:bg-slate-800/50",
                    isUploading && "pointer-events-none opacity-80"
                )}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    accept="image/*"
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className={cn(
                        "p-6 rounded-full transition-colors duration-300",
                        isDragging ? "bg-indigo-500/20" : "bg-slate-800 group-hover:bg-slate-700"
                    )}>
                        {isUploading ? (
                            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                        ) : (
                            <Upload className={cn(
                                "w-10 h-10 transition-colors duration-300",
                                isDragging ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400"
                            )} />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-slate-200">
                            {isUploading ? "Processing Page..." : "Upload Book Page"}
                        </h3>
                        <p className="text-slate-400 max-w-xs mx-auto">
                            {isUploading
                                ? "AI is analyzing text and finding vocabulary..."
                                : "Drag & drop or click to upload a photo of your book page"}
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
