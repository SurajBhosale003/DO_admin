import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "40"); // Default 40 as requested
        const skip = (page - 1) * limit;

        const category = searchParams.get("category");
        const type = searchParams.get("type");

        let filter: any = {};
        if (category && category !== "all") {
            filter.category = category;
        }
        if (type && type !== "all") {
            filter.type = type;
        }

        await connectDB();

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(filter); // Total based on filter

        return NextResponse.json({
            success: true,
            data: products,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
