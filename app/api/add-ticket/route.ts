import { NextResponse } from "next/server";
import DbConnect from "@/app/lib/dbConnect";
import Ticket from "@/app/models/ticket";

// POST /api/create-ticket
export async function POST(req: Request) {
  try {
    await DbConnect();
    const body = await req.json();
    const { title, description, priority } = body;

    // Validation
    if (!title || !description || !priority) {
      return NextResponse.json(
        { error: "All fields (title, description, priority) are required." },
        { status: 400 }
      );
    }

    // Create and save new ticket
    const newTicket = await Ticket.create({ title, description, priority });

    return NextResponse.json(
      { message: "Ticket created successfully", ticket: newTicket },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket", details: error.message },
      { status: 500 }
    );
  }
}
