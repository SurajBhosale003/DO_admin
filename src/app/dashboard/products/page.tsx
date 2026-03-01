"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Image as ImageIcon, Loader2 } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    image?: {
        thumbnail: string;
        low: string;
        mid: string;
        high: string;
        veryHigh: string;
    };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products?limit=500");
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Products ({products.length})</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <Link key={product._id} href={`/dashboard/products/${product._id}`}>
                            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                    {product.image?.mid || product.image?.thumbnail || product.image?.low ? (
                                        <img
                                            src={product.image.mid || product.image.thumbnail || product.image.low}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5">
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 flex-1 flex flex-col">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            No products found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
