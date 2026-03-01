import Link from "next/link";
import { Package, SettingsIcon } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/dashboard/products" className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-100 p-4 rounded-full text-amber-600">
                                <Package className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Edit Products</h2>
                                <p className="text-gray-500 mt-1">Manage inventory, descriptions, pricing, and variants.</p>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Placeholder for future options */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-dashed opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-200 p-4 rounded-full text-gray-500">
                            <SettingsIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                            <p className="text-gray-500 mt-1">Configure site details. (Coming Soon)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
