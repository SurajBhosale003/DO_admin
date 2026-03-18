"use client";

import React, { useState, useEffect } from "react";
import { 
    MessageSquare, 
    Users, 
    Calendar, 
    Mail, 
    Phone, 
    MapPin, 
    User, 
    CheckCircle2,
    Loader2,
    RefreshCw,
    Search
} from "lucide-react";

const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
    } catch (e) {
        return "N/A";
    }
};

const formatTime = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
    } catch (e) {
        return "N/A";
    }
};

export default function LeadsPage() {
    const [activeTab, setActiveTab] = useState<"contact" | "enquiry">("contact");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ contacts: any[], enquiries: any[] }>({ contacts: [], enquiries: [] });
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/leads");
            const result = await res.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filteredContacts = data.contacts.filter(c => 
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone || "").includes(searchTerm)
    );

    const filteredEnquiries = data.enquiries.filter(e => 
        (e.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (e.phone || "").includes(searchTerm) ||
        (e.city || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 uppercase text-amber-600">
                        Lead Management
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Manage customer inquiries and contact submissions
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchLeads}
                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="SEARCH LEADS..."
                            className="bg-white border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-[10px] font-black tracking-widest uppercase focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tab System */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 flex p-1.5 gap-1.5 w-fit">
                <button 
                    onClick={() => setActiveTab("contact")}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === "contact" ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-gray-400 hover:bg-gray-50"}`}
                >
                    <Mail size={14} /> Contact Leads
                    <span className={`px-2 py-0.5 rounded-full text-[8px] ${activeTab === "contact" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {data.contacts.length}
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab("enquiry")}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === "enquiry" ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-gray-400 hover:bg-gray-50"}`}
                >
                    <Users size={14} /> Homepage Inquiries
                    <span className={`px-2 py-0.5 rounded-full text-[8px] ${activeTab === "enquiry" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {data.enquiries.length}
                    </span>
                </button>
            </div>

            {/* Content Area */}
            {loading && data.contacts.length === 0 ? (
                <div className="h-96 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating leads from database...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Connection</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{activeTab === "contact" ? "Subject / Content" : "Region / City"}</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Acquisition Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activeTab === "contact" ? (
                                    filteredContacts.length > 0 ? filteredContacts.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{lead.name}</p>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer Lead</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-gray-600 text-[11px] truncate max-w-[180px]" title={lead.email}>
                                                        <Mail size={12} className="text-gray-300 shrink-0" /> {lead.email}
                                                    </div>
                                                    {lead.phone && (
                                                        <div className="flex items-center gap-2 text-gray-600 text-xs">
                                                            <Phone size={12} className="text-gray-300 shrink-0" /> {lead.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 max-w-md">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{lead.subject || "General Inquiry"}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-2 italic">{lead.message}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-0.5">
                                                        <Calendar size={12} className="text-gray-300" /> {formatDate(lead.createdAt)}
                                                    </div>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{formatTime(lead.createdAt)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">No contact leads matched your filters</td></tr>
                                    )
                                ) : (
                                    filteredEnquiries.length > 0 ? filteredEnquiries.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                        <CheckCircle2 size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{lead.name}</p>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pop-up Lead</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                                                    <Phone size={12} /> <span className="text-xs font-bold leading-none">{lead.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-gray-600 text-xs font-bold">
                                                    <MapPin size={12} className="text-gray-300" /> {lead.city}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-0.5">
                                                        <Calendar size={12} className="text-gray-300" /> {formatDate(lead.createdAt)}
                                                    </div>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{formatTime(lead.createdAt)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">No homepage inquiries matched your filters</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
