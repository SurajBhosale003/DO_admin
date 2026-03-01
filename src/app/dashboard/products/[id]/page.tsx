"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, LayoutGrid, Edit, Trash2, CheckCircle2, AlertTriangle, X } from "lucide-react";
import Link from "next/link";

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    serialNumber: string;
    type: string;
    image?: {
        thumbnail: string;
        low: string;
        mid: string;
        high: string;
        veryHigh: string;
    };
}

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [adjacent, setAdjacent] = useState<{ prev: string | null, next: string | null }>({ prev: null, next: null });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [showVariants, setShowVariants] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [filterOptions, setFilterOptions] = useState<{ categories: string[]; types: string[] }>({ categories: [], types: [] });

    // Load persisted variant preference on mount
    useEffect(() => {
        const savedPref = localStorage.getItem("adminShowVariants");
        if (savedPref !== null) {
            setShowVariants(savedPref === "true");
        }
    }, []);

    const toggleVariants = () => {
        setShowVariants((prev) => {
            const next = !prev;
            localStorage.setItem("adminShowVariants", String(next));
            return next;
        });
    };

    useEffect(() => {
        async function fetchFilters() {
            try {
                const res = await fetch("/api/products/filters");
                const data = await res.json();
                if (data.success) {
                    setFilterOptions(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch filters:", error);
            }
        }
        fetchFilters();
    }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch product details
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                }

                // Fetch adjacent next/prev products
                const adjRes = await fetch(`/api/products/${id}/adjacent`);
                const adjData = await adjRes.json();
                if (adjData.success) {
                    setAdjacent(adjData.data);
                }
            } catch (error) {
                console.error("Failed to fetch product data:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(""), 4000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!product) return;
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setSaving(true);

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Product updated successfully!");
            }
        } catch (error) {
            console.error("Failed to update product:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                // Return to product list or next item if available
                router.push(adjacent.next ? `/dashboard/products/${adjacent.next}` : "/dashboard/products");
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-700">Product not found</h2>
                <Link href="/dashboard/products" className="text-amber-600 hover:underline mt-4 inline-block">Return to Products</Link>
            </div>
        );
    }

    const mainImageUrl = product.image?.high || product.image?.veryHigh || product.image?.mid || product.image?.thumbnail;
    const thumbnailImageUrl = product.image?.thumbnail || product.image?.low || mainImageUrl;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32"> {/* Increased padding bottom to accommodate fixed float bar */}

            {/* Top Minimal Header (Back button & ID) */}
            <div className="flex items-center gap-4 py-2 border-b border-gray-200">
                <Link href="/dashboard/products" className="text-gray-400 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-none">{product.name || "Unnamed Product"}</h1>
                    <p className="text-sm text-gray-500 mt-1">ID: <span className="font-mono text-xs">{product._id}</span></p>
                </div>
            </div>

            {/* Top Section: Form Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Edit className="w-4 h-4 text-gray-500" />
                        Quick Edit Details
                    </h2>
                </div>

                <form id="editProductForm" onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 border focus:border-amber-500 focus:ring-amber-500 p-3 text-gray-900 bg-white placeholder-gray-400 font-medium transition-colors shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 border focus:border-amber-500 focus:ring-amber-500 p-3 text-gray-900 bg-white font-medium shadow-sm transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Category</label>
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 border focus:border-amber-500 focus:ring-amber-500 p-3 text-gray-900 bg-white font-medium shadow-sm transition-colors"
                        >
                            {!filterOptions.categories.includes(product.category) && (
                                <option value={product.category} className="capitalize">{product.category}</option>
                            )}
                            {filterOptions.categories.map((cat) => (
                                <option key={cat} value={cat} className="capitalize">{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Type</label>
                        <input
                            type="text"
                            name="type"
                            value={product.type}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 border focus:border-amber-500 focus:ring-amber-500 p-3 text-gray-900 bg-white font-medium shadow-sm transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Serial Number</label>
                        <input
                            type="text"
                            name="serialNumber"
                            value={product.serialNumber}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 border focus:border-amber-500 focus:ring-amber-500 p-3 text-gray-900 bg-white font-medium shadow-sm transition-colors"
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">Detailed Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 border focus:border-amber-500 focus:ring-amber-500 p-3 text-gray-900 bg-white font-medium leading-relaxed shadow-sm transition-colors resize-y"
                            placeholder="Enter product description here..."
                        />
                    </div>
                </form>
            </div>

            {/* Bottom Section: Media Viewer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gray-500" /> Media Preview
                    </h2>
                    <button
                        onClick={toggleVariants}
                        className={`text-sm font-medium flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${showVariants ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        {showVariants ? "Hide Variants" : "Show Variants"}
                    </button>
                </div>

                <div className="p-4 sm:p-6 bg-gray-50/30">
                    {!showVariants ? (
                        /* State 1: Single Main Image */
                        <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center p-4 aspect-video lg:aspect-[21/9] shadow-sm">
                            {mainImageUrl ? (
                                <img
                                    src={mainImageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImageIcon className="w-16 h-16 mb-3 opacity-30" />
                                    <span className="font-medium text-sm tracking-wide">No Primary Image</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* State 2: Four Variants Grid */
                        product.image ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
                                {[
                                    { label: "Very High", src: product.image.veryHigh },
                                    { label: "High", src: product.image.high },
                                    { label: "Mid", src: product.image.mid },
                                    { label: "Low / Thumb", src: product.image.low || product.image.thumbnail }
                                ].map((variant, idx) => (
                                    <div key={idx} className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-gray-50 p-2.5 border-b border-gray-100 flex items-center justify-center">
                                            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest leading-none">{variant.label}</p>
                                        </div>
                                        <div className="flex-1 p-4 flex items-center justify-center">
                                            {variant.src ? (
                                                <img src={variant.src} alt={variant.label} className="w-full h-32 sm:h-48 object-contain mix-blend-multiply" />
                                            ) : (
                                                <span className="text-xs font-medium text-gray-300">N/A</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center aspect-video lg:aspect-[21/9] text-gray-400 shadow-sm">
                                <ImageIcon className="w-16 h-16 mb-3 opacity-30" />
                                <span className="font-medium text-sm tracking-wide">No Variant Data</span>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* STICKY BOTTOM ACTION BAR: iPhone Style Floating Pill */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transform transition-transform duration-300 w-max max-w-[95vw]">
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full p-2 flex items-center justify-center gap-2 sm:gap-4">

                    {/* Left: Delete */}
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center justify-center gap-2 px-5 h-12 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full font-bold transition-colors flex-shrink-0"
                        title="Delete Product"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Delete</span>
                    </button>

                    {/* Middle: Navigation */}
                    <div className="flex items-center bg-gray-100/80 rounded-full p-1 border border-gray-200/50 flex-shrink-0">
                        <button
                            onClick={() => adjacent.prev && router.push(`/dashboard/products/${adjacent.prev}`)}
                            disabled={!adjacent.prev}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${adjacent.prev ? 'text-gray-700 hover:bg-white hover:text-amber-600 shadow-sm' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="w-[1px] h-6 bg-gray-300/50 mx-1"></div>
                        <button
                            onClick={() => adjacent.next && router.push(`/dashboard/products/${adjacent.next}`)}
                            disabled={!adjacent.next}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${adjacent.next ? 'text-gray-700 hover:bg-white hover:text-amber-600 shadow-sm' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right: Save Button */}
                    <button
                        type="submit"
                        form="editProductForm"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-6 h-12 bg-gray-900 text-white rounded-full hover:bg-amber-600 disabled:opacity-50 font-bold tracking-wide transition-all shadow-md active:scale-95 flex-shrink-0"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span className="hidden sm:inline">{saving ? "Saving" : "Save"}</span>
                    </button>
                </div>
            </div>

            {/* TOAST NOTIFICATION (Smooth pop-up from right) */}
            <div className={`fixed bottom-24 right-6 z-50 transform transition-all duration-500 ease-out ${toastMessage ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
                <div className="bg-gray-900 text-white px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-gray-700 max-w-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <p className="font-medium text-sm">{toastMessage}</p>
                </div>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        {/* Header */}
                        <div className="bg-red-50 border-b border-red-100 p-5 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 p-2 rounded-full text-red-600">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-red-900">Delete Product?</h3>
                            </div>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-red-400 hover:text-red-600 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="flex gap-4 items-start bg-gray-50 border border-gray-200 p-3 rounded-xl mb-4">
                                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {thumbnailImageUrl ? (
                                        <img src={thumbnailImageUrl} alt={product.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">SN: {product.serialNumber}</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase">{product.category} • {product.type}</p>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-2">
                                Are you sure you want to permanently delete this product from the database?
                            </p>
                            <p className="text-red-600 text-sm font-semibold">
                                This action cannot be undone.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 bg-white border border-gray-300 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                {deleting ? "Deleting..." : "Yes, Delete It"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
