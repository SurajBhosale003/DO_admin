import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
    name: string;
    phone: string;
    city: string;
    createdAt: Date;
    updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models?.Enquiry || mongoose.model<IEnquiry>("Enquiry", enquirySchema);
