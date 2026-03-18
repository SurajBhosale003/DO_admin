import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import { normalizeProductImages } from "@/lib/image-utils";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "40"); // Default 40 as requested
        const skip = (page - 1) * limit;

        const category = searchParams.get("category");
        const type = searchParams.get("type");
        const querySearch = searchParams.get("search");

        let filter: any = {};
        if (category && category !== "all") {
            filter.category = category;
        }
        if (type && type !== "all") {
            filter.type = type;
        }
        if (querySearch) {
            filter.$or = [
                { name: { $regex: querySearch, $options: "i" } },
                { serialNumber: { $regex: querySearch, $options: "i" } }
            ];
        }

        await connectDB();

        let products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(filter); // Total based on filter

        if (products && products.length > 0) {
            products = products.map((p: any) => normalizeProductImages(JSON.parse(JSON.stringify(p))));
        }

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
