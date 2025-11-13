import { NextResponse } from "next/server";
import DbConnect from "@/app/lib/dbConnect";
import Ticket from "@/app/models/ticket";

// READ all Tickets
export async function GET(req: Request) {
  try {
    await DbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Return single ticket
      const ticket = await Ticket.findById(id);
      if (!ticket)
        return NextResponse.json(
          { error: "Ticket not found" },
          { status: 404 }
        );
      return NextResponse.json(ticket, { status: 200 });
    }

    // Return all tickets
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
