import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Contact from "@/lib/models/Contact";
import Enquiry from "@/lib/models/Enquiry";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "all";

        let contacts = [];
        let enquiries = [];

        if (type === "all" || type === "contact") {
            contacts = await Contact.find().sort({ createdAt: -1 });
        }

        if (type === "all" || type === "enquiry") {
            enquiries = await Enquiry.find().sort({ createdAt: -1 });
        }

        return NextResponse.json({
            success: true,
            data: {
                contacts,
                enquiries
            }
        });
    } catch (error: any) {
        console.error("Leads API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
