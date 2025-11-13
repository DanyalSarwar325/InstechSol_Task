import { NextResponse } from "next/server";
import DbConnect from "@/app/lib/dbConnect";
import Ticket from "@/app/models/ticket";

export async function POST(req: Request) {
  try {
    await DbConnect();

    const data = await req.json();
    console.log(" request body:", data);

    const ticket = await Ticket.create(data);
    console.log("Created ticket:", ticket);
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/add-ticket:", error);
    // Include error message to aid debugging (remove in production)
    return NextResponse.json(
      { error: "Failed to create ticket", details: (error as Error).message },
      { status: 500 }
    );
  }
}
