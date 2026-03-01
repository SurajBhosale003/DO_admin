import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        await connectDB();

        // Very lightweight query, only fetching _id and keeping exactly same sort as the list page
        const products = await Product.find({}, '_id').sort({ createdAt: -1 }).lean();

        const currentIndex = products.findIndex(p => p._id.toString() === id);

        if (currentIndex === -1) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const prevProduct = currentIndex > 0 ? products[currentIndex - 1]._id : null;
        const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1]._id : null;

        return NextResponse.json({
            success: true,
            data: {
                prev: prevProduct,
                next: nextProduct
            }
        });
    } catch (error) {
        console.error("Error fetching adjacent products:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
