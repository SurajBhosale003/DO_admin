"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchProduct();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!product) return;
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setSaving(true);
        setSuccess("");

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess("Product updated successfully!");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (error) {
            console.error("Failed to update product:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
            </div>
        );
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/products" className="text-gray-500 hover:text-gray-900 border border-gray-200 p-2 rounded-md hover:bg-gray-50">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex-1">Edit Product: <span className="text-gray-500">{product.serialNumber}</span></h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 font-medium shadow-sm transition-colors"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? "Saving..." : "Save / Update"}
                </button>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md animate-fade-in">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Left Column: Form Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4">Basic Information</h2>

                        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border bg-gray-50 cursor-not-allowed"
                                    disabled // Disabled because it affects the unique index and cloudinary folder matching usually
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                                <input
                                    type="text"
                                    name="serialNumber"
                                    value={product.serialNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border bg-gray-50 cursor-not-allowed"
                                    disabled // Disabled for same reason
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={product.type}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Image Preview */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-4 mb-4">Image Preview</h2>

                        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center min-h-[300px]">
                            {product.image?.mid || product.image?.high || product.image?.thumbnail ? (
                                <img
                                    src={product.image.high || product.image.mid || product.image.thumbnail}
                                    alt={product.name}
                                    className="w-full h-auto object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImageIcon className="w-12 h-12 mb-2" />
                                    <span>No image available</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center">
                            <input
                                id="showVariants"
                                type="checkbox"
                                checked={showVariants}
                                onChange={(e) => setShowVariants(e.target.checked)}
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showVariants" className="ml-2 block text-sm text-gray-900 font-medium">
                                Show Variant Preview (All resolutions)
                            </label>
                        </div>

                        {showVariants && product.image && (
                            <div className="mt-4 grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex flex-col text-xs text-center space-y-1">
                                    <span className="font-semibold text-gray-600">Thumbnail</span>
                                    <img src={product.image.thumbnail} alt="Thumbnail preview" className="w-full h-24 object-contain bg-white border rounded" />
                                </div>
                                <div className="flex flex-col text-xs text-center space-y-1">
                                    <span className="font-semibold text-gray-600">Low</span>
                                    <img src={product.image.low} alt="Low preview" className="w-full h-24 object-contain bg-white border rounded" />
                                </div>
                                <div className="flex flex-col text-xs text-center space-y-1">
                                    <span className="font-semibold text-gray-600">Mid</span>
                                    <img src={product.image.mid} alt="Mid preview" className="w-full h-24 object-contain bg-white border rounded" />
                                </div>
                                <div className="flex flex-col text-xs text-center space-y-1">
                                    <span className="font-semibold text-gray-600">Very High</span>
                                    <img src={product.image.veryHigh} alt="High preview" className="w-full h-24 object-contain bg-white border rounded" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
