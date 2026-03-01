"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isScrolled, setIsScrolled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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

    // Handle Scroll for sticky UI
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
                setIsExpanded(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Debounce Search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (debouncedSearch !== searchQuery) {
                setDebouncedSearch(searchQuery);
                setPage(1); // Reset page on new search
            }
        }, 400); // 400ms debounce
        return () => clearTimeout(handler);
    }, [searchQuery, debouncedSearch]);

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
                if (debouncedSearch) params.append("search", debouncedSearch);

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
    }, [page, category, type, debouncedSearch]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setPage(1); // Reset to page 1 on filter change
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value);
        setPage(1); // Reset to page 1 on filter change
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    Products <span className="text-gray-500 text-xl font-medium">({totalProducts} actual items)</span>
                </h1>

                {/* Stick Spacer */}
                {isScrolled && <div className="hidden lg:block w-[500px]" />}

                {/* Filters & Search - Sticky & Collapsible UI */}
                <div className={`z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isScrolled
                        ? `fixed left-1/2 -translate-x-1/2 top-4 ${isExpanded ? 'w-[95%] max-w-4xl' : 'w-max'}`
                        : "relative top-0 w-full lg:w-auto"
                    }`}>
                    <div
                        onClick={() => {
                            if (isScrolled && !isExpanded) setIsExpanded(true);
                        }}
                        className={`overflow-hidden transition-all duration-500 border ${isScrolled && !isExpanded
                                ? "bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full cursor-pointer hover:bg-gray-50 hover:scale-105 active:scale-95"
                                : "bg-white border-gray-200 shadow-sm rounded-2xl p-3"
                            }`}
                    >
                        {isScrolled && !isExpanded ? (
                            // Minimized Floating Pill
                            <div className="flex items-center gap-2 px-5 py-3 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-bold text-gray-700 hidden sm:block tracking-wide whitespace-nowrap">
                                    {searchQuery ? `"${searchQuery}"` : "Search & Filter"}
                                </span>
                                {(category !== 'all' || type !== 'all' || searchQuery) && (
                                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full ml-1.5 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                                )}
                            </div>
                        ) : (
                            // Expanded / Default View
                            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between sm:justify-start gap-3 w-full">
                                <div className="flex items-center justify-between w-full sm:w-auto">
                                    {/* Search Bar */}
                                    <div className="flex items-center gap-2 bg-gray-50 border border-transparent focus-within:border-amber-300 focus-within:bg-white rounded-xl px-4 py-2.5 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all w-full sm:w-auto flex-grow">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by name or serial..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent text-sm w-full sm:w-64 focus:outline-none text-gray-900 font-semibold placeholder-gray-400"
                                        />
                                    </div>

                                    {/* Mobile Close Button */}
                                    {isScrolled && isExpanded && (
                                        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="sm:hidden p-2 rounded-full hover:bg-gray-100 ml-2 border border-gray-200">
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    )}
                                </div>

                                <div className="hidden sm:block w-[1px] h-8 bg-gray-200 mx-1"></div>

                                {/* Filters Row */}
                                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg shrink-0">
                                        <Filter className="w-3.5 h-3.5" /> Filters
                                    </div>
                                    <select
                                        value={category}
                                        onChange={handleCategoryChange}
                                        className="appearance-none bg-gray-50 border-none rounded-xl text-sm py-2 px-4 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white text-gray-800 font-bold cursor-pointer shrink-0 transition-all shadow-sm"
                                    >
                                        <option value="all">Any Category</option>
                                        {filterOptions.categories.map(cat => (
                                            <option key={cat} value={cat} className="capitalize">{cat}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={type}
                                        onChange={handleTypeChange}
                                        className="appearance-none bg-gray-50 border-none rounded-xl text-sm py-2 px-4 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:bg-white text-gray-800 font-bold cursor-pointer shrink-0 transition-all shadow-sm"
                                    >
                                        <option value="all">Any Type</option>
                                        {filterOptions.types.map(t => (
                                            <option key={t} value={t} className="capitalize">{t}</option>
                                        ))}
                                    </select>

                                    {/* Desktop Close Button */}
                                    {isScrolled && isExpanded && (
                                        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-gray-100 bg-gray-50 border border-gray-200 ml-auto shrink-0 transition-all active:scale-95">
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
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
