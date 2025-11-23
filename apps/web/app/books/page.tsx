"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Book, Plus, Loader2 } from "lucide-react";

interface BookData {
    id: string;
    title: string;
    author: string;
    _count: {
        pages: number;
    };
}

export default function BooksPage() {
    const [books, setBooks] = useState<BookData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newBookTitle, setNewBookTitle] = useState("");
    const [newBookAuthor, setNewBookAuthor] = useState("");

    const fetchBooks = async () => {
        try {
            const res = await fetch("/api/books");
            if (!res.ok) throw new Error("Failed to fetch books");
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleCreateBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBookTitle || !newBookAuthor) return;

        try {
            const res = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newBookTitle, author: newBookAuthor }),
            });

            if (!res.ok) throw new Error("Failed to create book");

            setNewBookTitle("");
            setNewBookAuthor("");
            setIsCreating(false);
            fetchBooks();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Books</h1>
                    <p className="text-muted-foreground">Manage your reading collection</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Book</span>
                </button>
            </div>

            {isCreating && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-foreground mb-4">Add New Book</h2>
                        <form onSubmit={handleCreateBook} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newBookTitle}
                                    onChange={(e) => setNewBookTitle(e.target.value)}
                                    className="w-full bg-secondary border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                                    placeholder="e.g., The Great Gatsby"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    value={newBookAuthor}
                                    onChange={(e) => setNewBookAuthor(e.target.value)}
                                    className="w-full bg-secondary border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                                    placeholder="e.g., F. Scott Fitzgerald"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                                >
                                    Create Book
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <Link
                        key={book.id}
                        href={`/book/${book.id}`}
                        className="group block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-accent/50 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                                <Book className="w-8 h-8 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                                {book._count.pages} pages
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {book.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">{book.author}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
