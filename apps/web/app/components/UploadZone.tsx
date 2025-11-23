"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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

interface ImageUploadProgress {
    file: File;
    status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
    uploadProgress: number;  // 0-100
    error?: string;
    preview: string;
}

const CONCURRENT_UPLOADS = 2; // Max concurrent uploads (reduced to avoid Bedrock rate limits)

export default function UploadZone({ bookId, onUploadComplete }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadQueue, setUploadQueue] = useState<ImageUploadProgress[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
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
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    }, []);

    const handleFiles = (files: File[]) => {
        // Limit to 10 files
        const validFiles = files
            .filter(f => f.type.startsWith("image/"))
            .slice(0, 10);

        if (validFiles.length === 0) {
            return;
        }

        // Create upload queue with previews
        const newQueue: ImageUploadProgress[] = validFiles.map(file => ({
            file,
            status: 'pending' as const,
            uploadProgress: 0,
            preview: URL.createObjectURL(file),
        }));

        setUploadQueue(newQueue);
        processQueueParallel(newQueue);
    };

    const uploadWithProgress = (
        file: File,
        index: number
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append("file", file);
            if (bookId) {
                formData.append("bookId", bookId);
            }

            // Track upload progress
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setUploadQueue(prev =>
                        prev.map((q, i) =>
                            i === index ? { ...q, uploadProgress: percentComplete, status: 'uploading' } : q
                        )
                    );
                }
            });

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Upload complete, now processing
                    setUploadQueue(prev =>
                        prev.map((q, i) =>
                            i === index ? { ...q, status: 'processing' } : q
                        )
                    );
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error("Upload failed"));
                }
            });

            xhr.addEventListener("error", () => {
                reject(new Error("Network error"));
            });

            xhr.open("POST", "/api/upload");
            xhr.send(formData);
        });
    };

    const processQueueParallel = async (queue: ImageUploadProgress[]) => {
        setIsProcessing(true);

        const uploadPromises = queue.map((item, index) =>
            uploadWithProgress(item.file, index)
                .then(() => {
                    // Mark complete
                    setUploadQueue(prev =>
                        prev.map((q, i) =>
                            i === index ? { ...q, status: 'complete' } : q
                        )
                    );
                })
                .catch((error) => {
                    // Mark error
                    setUploadQueue(prev =>
                        prev.map((q, i) =>
                            i === index ? { ...q, status: 'error', error: error.message } : q
                        )
                    );
                })
        );

        // Process with concurrency limit
        for (let i = 0; i < uploadPromises.length; i += CONCURRENT_UPLOADS) {
            await Promise.all(uploadPromises.slice(i, i + CONCURRENT_UPLOADS));
        }

        setIsProcessing(false);

        // Call onUploadComplete after all uploads
        if (onUploadComplete) {
            onUploadComplete();
        } else {
            router.refresh();
        }
    };

    const clearQueue = () => {
        // Revoke object URLs to prevent memory leaks
        uploadQueue.forEach(item => URL.revokeObjectURL(item.preview));
        setUploadQueue([]);
    };

    const getStatusIcon = (status: ImageUploadProgress['status']) => {
        switch (status) {
            case 'uploading':
            case 'processing':
                return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
            case 'complete':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-destructive" />;
            default:
                return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />;
        }
    };

    const completedCount = uploadQueue.filter(q => q.status === 'complete').length;
    const totalCount = uploadQueue.length;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Upload Zone */}
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
                    isProcessing && "pointer-events-none opacity-80"
                )}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    accept="image/*"
                    disabled={isProcessing}
                    multiple
                />

                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className={cn(
                        "p-6 rounded-full transition-colors duration-300",
                        isDragging ? "bg-primary/20" : "bg-secondary group-hover:bg-secondary/80"
                    )}>
                        {isProcessing ? (
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
                            {isProcessing ? `Processing ${completedCount}/${totalCount} Pages...` : "Upload Book Pages"}
                        </h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            {isProcessing
                                ? "Processing in parallel for faster results..."
                                : "Drag & drop or click to upload up to 10 photos"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload Queue */}
            {uploadQueue.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-foreground">
                            Upload Progress ({completedCount}/{totalCount})
                        </h4>
                        {!isProcessing && completedCount === totalCount && (
                            <button
                                onClick={clearQueue}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {uploadQueue.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                            >
                                {/* Thumbnail */}
                                <img
                                    src={item.preview}
                                    alt={item.file.name}
                                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                                />

                                {/* File Info & Progress */}
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {item.file.name}
                                        </p>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                            {getStatusIcon(item.status)}
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {item.status === 'uploading'
                                                    ? `${item.uploadProgress}%`
                                                    : item.status === 'processing'
                                                        ? 'Analyzing...'
                                                        : item.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {(item.status === 'uploading' || item.status === 'processing') && (
                                        <div className="w-full">
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                {item.status === 'uploading' ? (
                                                    <div
                                                        className="h-full bg-primary transition-all duration-300"
                                                        style={{ width: `${item.uploadProgress}%` }}
                                                    />
                                                ) : (
                                                    <div className="h-full bg-primary animate-pulse w-full" />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {item.error && (
                                        <div className="flex items-center space-x-2 text-destructive">
                                            <AlertCircle className="w-3 h-3" />
                                            <span className="text-xs">{item.error}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
