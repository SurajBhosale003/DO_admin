"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Edit, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, Filter, Search, X, Eye, EyeOff, CheckSquare, Square, Settings2 } from "lucide-react";

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

    interface VisibleFields { name: boolean; category: boolean; price: boolean; }
    const [visibleFields, setVisibleFields] = useState<VisibleFields>({ name: true, category: true, price: true });
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
    const visibilityMenuRef = useRef<HTMLDivElement>(null);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({ categories: [], types: [] });

    // Handle clicking outside the visibility menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (visibilityMenuRef.current && !visibilityMenuRef.current.contains(event.target as Node)) {
                setShowVisibilityMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Load persisted preferences
    useEffect(() => {
        try {
            const savedFields = localStorage.getItem("adminVisibleFields");
            if (savedFields) {
                setVisibleFields(JSON.parse(savedFields));
            }
        } catch (e) {
            console.error("Failed to load visibility preferences:", e);
        }
    }, []);

    const toggleFieldVisibility = (field: keyof VisibleFields) => {
        setVisibleFields(prev => {
            const next = { ...prev, [field]: !prev[field] };
            localStorage.setItem("adminVisibleFields", JSON.stringify(next));
            return next;
        });
    };

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
                <div>
                    <h2 className="text-amber-600 font-extrabold tracking-[0.2em] text-[10px] uppercase mb-1 text-opacity-80">Dattaraj Ornaments</h2>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-baseline gap-3 tracking-tight">
                        Products <span className="text-gray-500 text-lg sm:text-xl font-bold bg-gray-100/80 px-3 py-1 rounded-xl shadow-inner">({totalProducts})</span>
                    </h1>
                </div>

                {/* Stick Spacer */}
                {isScrolled && <div className="hidden lg:block w-[500px]" />}

                {/* Filters & Search - Sticky & Collapsible UI */}
                <div className={`z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isScrolled
                    ? `fixed left-1/2 -translate-x-1/2 top-[120px] sm:top-24 ${isExpanded ? 'w-[95%] max-w-4xl' : 'w-max'}`
                    : "relative top-0 w-full lg:w-auto"
                    }`}>
                    <div
                        onClick={() => {
                            if (isScrolled && !isExpanded) setIsExpanded(true);
                        }}
                        className={`transition-all duration-500 border ${isScrolled && !isExpanded
                            ? "overflow-hidden bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full cursor-pointer hover:bg-gray-50 hover:scale-105 active:scale-95"
                            : "overflow-visible bg-white border-gray-200 shadow-sm rounded-2xl p-3"
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
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-start gap-0 w-full rounded-2xl sm:rounded-full bg-white sm:bg-transparent">
                                <div className="flex items-center justify-between w-full sm:w-auto p-1 sm:p-0 border-b border-gray-100 sm:border-none">
                                    {/* Search Bar */}
                                    <div className="flex items-center gap-2 bg-gray-50 sm:bg-transparent border border-transparent focus-within:border-amber-300 sm:focus-within:border-transparent focus-within:bg-white rounded-xl px-4 py-2.5 transition-all w-full sm:w-auto flex-grow h-[42px] sm:h-auto">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by name or serial..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent text-sm w-full sm:w-56 focus:outline-none text-gray-900 font-semibold placeholder-gray-400"
                                        />
                                    </div>

                                    {/* Mobile Close Button */}
                                    {isScrolled && isExpanded && (
                                        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="sm:hidden p-2 rounded-full hover:bg-gray-100 ml-2 border border-gray-200">
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    )}
                                </div>

                                <div className="hidden sm:block w-[1px] h-6 bg-gray-200 mx-1"></div>

                                {/* Filters Row */}
                                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto p-2 sm:p-0 overflow-visible">
                                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 sm:bg-transparent px-3 sm:px-1 py-1.5 rounded-lg shrink-0">
                                        <Filter className="w-3.5 h-3.5" /> Filters
                                    </div>
                                    <select
                                        value={category}
                                        onChange={handleCategoryChange}
                                        className="appearance-none bg-gray-50 border border-gray-100 sm:border-none rounded-xl sm:rounded-md text-sm py-2 sm:py-1.5 px-3 w-full sm:w-auto text-center sm:text-left focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:bg-white text-gray-800 font-bold cursor-pointer shrink-0 transition-all hover:bg-gray-100"
                                    >
                                        <option value="all">Any Category</option>
                                        {filterOptions.categories.map(cat => (
                                            <option key={cat} value={cat} className="capitalize">{cat}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={type}
                                        onChange={handleTypeChange}
                                        className="appearance-none bg-gray-50 border border-gray-100 sm:border-none rounded-xl sm:rounded-md text-sm py-2 sm:py-1.5 px-3 w-full sm:w-auto text-center sm:text-left focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:bg-white text-gray-800 font-bold cursor-pointer shrink-0 transition-all hover:bg-gray-100"
                                    >
                                        <option value="all">Any Type</option>
                                        {filterOptions.types.map(t => (
                                            <option key={t} value={t} className="capitalize">{t}</option>
                                        ))}
                                    </select>

                                    {/* Visibility Dropdown Toggle */}
                                    <div className="relative col-span-2 sm:col-span-1" ref={visibilityMenuRef}>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowVisibilityMenu(!showVisibilityMenu); }}
                                            title="Configure text visibility"
                                            className="flex items-center justify-center w-full sm:w-auto gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 sm:border-none rounded-xl sm:rounded-md text-sm py-2 sm:py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500/10 text-gray-700 font-bold shrink-0 transition-all active:scale-95 shadow-sm sm:shadow-none"
                                        >
                                            <Settings2 className="w-4 h-4 text-emerald-600" />
                                            <span className="inline">Display</span>
                                        </button>

                                        {showVisibilityMenu && (
                                            <div className="absolute right-0 left-0 sm:left-auto mt-2 w-auto sm:w-52 bg-white/95 backdrop-blur-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-2xl z-[100] p-2 transform origin-top transition-all">
                                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 px-2 mt-1 hidden sm:block">Show on card</div>

                                                <div
                                                    className="flex items-center justify-between p-2.5 sm:p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                                    onClick={() => toggleFieldVisibility('name')}
                                                >
                                                    <span className="text-sm font-semibold text-gray-700">Name</span>
                                                    {visibleFields.name ? <CheckSquare className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-500" /> : <Square className="w-5 h-5 sm:w-4 sm:h-4 text-gray-300" />}
                                                </div>

                                                <div
                                                    className="flex items-center justify-between p-2.5 sm:p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                                    onClick={() => toggleFieldVisibility('category')}
                                                >
                                                    <span className="text-sm font-semibold text-gray-700">Category & Type</span>
                                                    {visibleFields.category ? <CheckSquare className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-500" /> : <Square className="w-5 h-5 sm:w-4 sm:h-4 text-gray-300" />}
                                                </div>

                                                <div
                                                    className="flex items-center justify-between p-2.5 sm:p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                                    onClick={() => toggleFieldVisibility('price')}
                                                >
                                                    <span className="text-sm font-semibold text-gray-700">Price</span>
                                                    {visibleFields.price ? <CheckSquare className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-500" /> : <Square className="w-5 h-5 sm:w-4 sm:h-4 text-gray-300" />}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop Close Button */}
                                {isScrolled && isExpanded && (
                                    <div className="hidden sm:flex ml-auto pl-2 pr-1">
                                        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="flex items-center justify-center p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors active:scale-95">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {
                loading ? (
                    <div className="flex justify-center items-center h-64" >
                        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 mt-4">
                            {products.map((product) => (
                                <Link key={product._id} href={`/dashboard/products/${product._id}`}>
                                    <div className="group relative w-full aspect-[4/5] sm:aspect-square bg-gray-100 overflow-hidden cursor-pointer shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 active:scale-[0.99] border border-gray-200/60">
                                        {/* Full Bleed Image */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                                            {product.image?.mid || product.image?.thumbnail || product.image?.low ? (
                                                <img
                                                    src={product.image.mid || product.image.thumbnail || product.image.low}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                                                />
                                            ) : (
                                                <ImageIcon className="w-10 h-10 text-gray-300" />
                                            )}
                                        </div>

                                        {/* Dark Gradient Overlay for Text Readability - Only visible if AT LEAST ONE text layer is showing */}
                                        {(visibleFields.name || visibleFields.category || visibleFields.price) && (
                                            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        )}

                                        {/* Top Right 'Edit' Floating Action */}
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                                            <Edit className="w-4 h-4 text-gray-900" />
                                        </div>

                                        {/* Text Content Overlaid */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end translate-y-1 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                                            {/* Tags */}
                                            {visibleFields.category && (
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="text-[9px] text-white/90 font-extrabold uppercase tracking-[0.2em]">{product.category || "Uncategorized"}</span>
                                                    {product.type && <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest">• {product.type}</span>}
                                                </div>
                                            )}

                                            {/* Product Title */}
                                            {visibleFields.name && (
                                                <h3 className="text-[14px] sm:text-[15px] font-bold text-white line-clamp-2 leading-tight drop-shadow-md" title={product.name}>
                                                    {product.name}
                                                </h3>
                                            )}

                                            {/* Price */}
                                            {visibleFields.price && (
                                                <div className="mt-2 flex items-center">
                                                    <span className="font-extrabold text-amber-400 text-[14px] sm:text-[15px] drop-shadow-md">
                                                        ₹{product.price?.toLocaleString('en-IN') || "0"}
                                                    </span>
                                                </div>
                                            )}
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
                )
            }
        </div >
    );
}
