import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";

export async function GET() {
    try {
        await connectDB();

        const categories = await Product.distinct("category");
        const types = await Product.distinct("type");

        return NextResponse.json({
            success: true,
            data: {
                categories: categories.sort(),
                types: types.sort(),
            },
        });
    } catch (error) {
        console.error("Error fetching filters:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
