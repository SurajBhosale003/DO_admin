import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Product from "@/lib/models/Product";
import { normalizeProductImages } from "@/lib/image-utils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        await connectDB();
        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: normalizeProductImages(product) });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const updateData = await request.json();

        await connectDB();
        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: normalizeProductImages(JSON.parse(JSON.stringify(product))) });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        await connectDB();
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
