"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Home, Package, MessageSquare } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 sm:h-20 items-center">
                        {/* Logo / Brand */}
                        <div className="flex-shrink-0 flex items-center gap-3 sm:gap-6">
                            <div className="flex flex-col">
                                <span className="text-amber-600 font-extrabold tracking-[0.2em] text-[8px] sm:text-[10px] uppercase mb-0.5">Dattaraj Ornaments</span>
                                <span className="text-sm sm:text-xl font-black text-gray-900 tracking-tight leading-none pr-4 sm:border-r border-gray-100">
                                    Inventory Management
                                </span>
                            </div>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center space-x-2">
                                <Link href="/dashboard" className="text-gray-500 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 font-bold text-sm flex items-center gap-2 transition-colors">
                                    <Home className="w-4 h-4" />
                                    Overview
                                </Link>
                                <Link href="/dashboard/products" className="text-gray-500 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 font-bold text-sm flex items-center gap-2 transition-colors">
                                    <Package className="w-4 h-4" />
                                    Products
                                </Link>
                                <Link href="/dashboard/leads" className="text-gray-500 hover:text-amber-600 hover:bg-amber-50 px-4 py-2 font-bold text-sm flex items-center gap-2 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    Leads
                                </Link>
                            </nav>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-red-100 text-xs sm:text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors active:scale-95"
                            >
                                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav Bar - Bottom or just under header */}
                <div className="md:hidden border-t border-gray-100 bg-gray-50 flex">
                    <Link href="/dashboard" className="flex-1 text-center py-3 text-xs font-bold text-gray-600 flex flex-col items-center gap-1 hover:text-amber-600 hover:bg-amber-50 border-r border-gray-100 transition-colors">
                        <Home className="w-4 h-4" />
                        Overview
                    </Link>
                    <Link href="/dashboard/products" className="flex-1 text-center py-3 text-xs font-bold text-gray-600 flex flex-col items-center gap-1 hover:text-amber-600 hover:bg-amber-50 border-r border-gray-100 transition-colors">
                        <Package className="w-4 h-4" />
                        Products
                    </Link>
                    <Link href="/dashboard/leads" className="flex-1 text-center py-3 text-xs font-bold text-gray-600 flex flex-col items-center gap-1 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Leads
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {children}
            </main>
        </div>
    );
}
