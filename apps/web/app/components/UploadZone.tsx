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
                    "bg-card/50 backdrop-blur-sm",
                    isDragging
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-card",
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
                        isDragging ? "bg-primary/20" : "bg-secondary group-hover:bg-secondary/80"
                    )}>
                        {isUploading ? (
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        ) : (
                            <Upload className={cn(
                                "w-10 h-10 transition-colors duration-300",
                                isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                            )} />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                            {isUploading ? "Processing Page..." : "Upload Book Page"}
                        </h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            {isUploading
                                ? "AI is analyzing text and finding vocabulary..."
                                : "Drag & drop or click to upload a photo of your book page"}
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
