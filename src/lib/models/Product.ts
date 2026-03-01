import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    category: string;
    image: {
        thumbnail: string;
        low: string;
        mid: string;
        high: string;
        veryHigh: string;
    };
    description: string;
    price: number;
    serialNumber: string;
    type: string;
    lastUpdated: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        image: {
            thumbnail: { type: String, default: "" },
            low: { type: String, default: "" },
            mid: { type: String, default: "" },
            high: { type: String, default: "" },
            veryHigh: { type: String, default: "" },
        },
        description: { type: String, default: "" },
        price: { type: Number, default: 0 },
        serialNumber: { type: String, required: true },
        type: { type: String, default: "gold" },
        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// We need to check if the index exists before creating to prevent duplicate errors in Next.js hot reload
export default mongoose.models?.Product || mongoose.model<IProduct>("Product", productSchema);
