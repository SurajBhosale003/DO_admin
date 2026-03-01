"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface Product {
    _id: string;
    name: string;
    category: string;
    type: string;
    price: number;
    image?: {
        thumbnail: string;
        low: string;
        mid: string;
        high: string;
        veryHigh: string;
    };
}

interface FilterOptions {
    categories: string[];
    types: string[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [category, setCategory] = useState("all");
    const [type, setType] = useState("all");

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({ categories: [], types: [] });

    // Fetch filter options once
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

    // Fetch products whenever page, category, or type changes
    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    limit: "40",
                    page: page.toString(),
                });
                if (category !== "all") params.append("category", category);
                if (type !== "all") params.append("type", type);

                const res = await fetch(`/api/products?${params.toString()}`);
                const data = await res.json();

                if (data.success) {
                    setProducts(data.data);
                    setTotalProducts(data.total);
                    setTotalPages(data.pages);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [page, category, type]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setPage(1); // Reset to page 1 on filter change
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value);
        setPage(1); // Reset to page 1 on filter change
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    Products <span className="text-gray-500 text-xl font-medium">({totalProducts} actual items)</span>
                </h1>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mr-2">
                        <Filter className="w-4 h-4" />
                        Filters:
                    </div>
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-900"
                    >
                        <option value="all">All Categories</option>
                        {filterOptions.categories.map(cat => (
                            <option key={cat} value={cat} className="capitalize">{cat}</option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={handleTypeChange}
                        className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 text-gray-900"
                    >
                        <option value="all">All Types</option>
                        {filterOptions.types.map(t => (
                            <option key={t} value={t} className="capitalize">{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                </div>
            ) : (
                <>
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
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">{product.category}</span>
                                            {product.type && <span className="text-[10px] text-gray-400 uppercase tracking-wider">{product.type}</span>}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full py-24 text-center">
                                <p className="text-gray-500 text-lg">No products found matching these filters.</p>
                                <button
                                    onClick={() => { setCategory("all"); setType("all"); }}
                                    className="mt-4 text-amber-600 hover:text-amber-700 font-medium hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
