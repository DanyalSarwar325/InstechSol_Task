import { NextResponse } from "next/server";
import DbConnect from "@/app/lib/dbConnect";
import Ticket from "@/app/models/ticket";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } //  params is now a Promise
) {
  try {
    await DbConnect();
    const params = await context.params; //  await the params here
    const { id } = params;
    console.log("Updating ticket with ID:", id);
    const data = await req.json();
    console.log("Update request data:", data);

    const updatedTicket = await Ticket.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
