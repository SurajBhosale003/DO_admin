"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Home, Package } from "lucide-react";

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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center space-x-4">
                            <span className="text-xl font-bold text-gray-900 border-r pr-4">Admin Portal</span>
                            <nav className="hidden sm:flex space-x-4">
                                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/products" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Products
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
