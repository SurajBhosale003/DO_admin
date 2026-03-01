import Link from "next/link";
import { Package, Settings2, BarChart3, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6 sm:space-y-10 pb-20">
            {/* Header section matching branding */}
            <div>
                <h2 className="text-amber-600 font-extrabold tracking-[0.2em] text-[10px] uppercase mb-1 text-opacity-80">Overview</h2>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    Dashboard
                </h1>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                {/* Active Card - Products */}
                <Link href="/dashboard/products" className="group block h-full">
                    <div className="bg-white border border-gray-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:border-amber-200/50 transition-all duration-300 p-6 flex flex-col h-full relative overflow-hidden active:scale-[0.99] cursor-pointer">
                        {/* Decorative Background Accent */}
                        <div className="absolute top-0 right-0 p-8 bg-gradient-to-bl from-amber-50 to-transparent -translate-y-1/2 translate-x-1/2 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

                        <div className="bg-amber-50 self-start p-3.5 mb-6 text-amber-600 shadow-sm border border-amber-100/50 relative z-10 transition-transform group-hover:scale-110 duration-300">
                            <Package className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>

                        <div className="relative z-10 flex-grow">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">Manage Products</h2>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">View, edit, and filter your active inventory, prices, and jewelry images.</p>
                        </div>

                        {/* Hover Call-to-action */}
                        <div className="mt-6 flex items-center text-amber-600 text-sm font-bold tracking-wide uppercase opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 relative z-10">
                            Open Catalog &rarr;
                        </div>
                    </div>
                </Link>

                {/* Coming Soon Cards */}
                <div className="bg-gray-50/50 border border-gray-200 border-dashed p-6 flex flex-col h-full relative cursor-not-allowed opacity-60">
                    <div className="bg-gray-200 self-start p-3.5 mb-6 text-gray-500 relative z-10">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="relative z-10 flex-grow">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Customers</h2>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">Manage user accounts and history. <span className="text-amber-600 block mt-1">(Coming Soon)</span></p>
                    </div>
                </div>

                <div className="bg-gray-50/50 border border-gray-200 border-dashed p-6 flex flex-col h-full relative cursor-not-allowed opacity-60">
                    <div className="bg-gray-200 self-start p-3.5 mb-6 text-gray-500 relative z-10">
                        <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="relative z-10 flex-grow">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Analytics</h2>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">View traffic and item popularity. <span className="text-amber-600 block mt-1">(Coming Soon)</span></p>
                    </div>
                </div>

                <div className="bg-gray-50/50 border border-gray-200 border-dashed p-6 flex flex-col h-full relative cursor-not-allowed opacity-60">
                    <div className="bg-gray-200 self-start p-3.5 mb-6 text-gray-500 relative z-10">
                        <Settings2 className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="relative z-10 flex-grow">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Settings</h2>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">Configure global store details. <span className="text-amber-600 block mt-1">(Coming Soon)</span></p>
                    </div>
                </div>

            </div>
        </div>
    );
}
