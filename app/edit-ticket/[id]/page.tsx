"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // 👈 Import toast and Toaster

export default function EditTicketPage() {
  const router = useRouter();
  // Ensure that params is handled correctly for destructuring
  const params = useParams();
  // Safely access the ID, handling potential array type from Next.js dynamic routing
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(true);

  // Fetch ticket details
  useEffect(() => {
    // Only fetch if an ID is available
    if (!id) return; 

    const fetchTicket = async () => {
      try {
        // NOTE: The backend endpoint might need to be `/api/get-tickets/${id}` 
        // if it follows REST conventions for single resources.
        const res = await fetch(`/api/get-tickets?id=${id}`);
        const data = await res.json();
        setTicket(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        toast.error("Failed to load ticket details.");
      }
    };
    fetchTicket();
  }, [id]); // Depend on 'id'

  //  Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  // Update ticket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show a loading toast
    const loadingToastId = toast.loading("Updating ticket...");

    try {
      const res = await fetch(`/api/update-tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });

      if (res.ok) {
        // Replace alert with success toast and dismiss loading toast
        toast.success(" Ticket updated successfully!", { id: loadingToastId });
        
        // Wait a moment for the user to see the toast, then redirect
        setTimeout(() => {
            router.push("/view-tickets");
        }, 800);
      } else {
        // Replace alert with error toast
        const errorText = await res.text();
        console.error("Update failed response:", errorText);
        toast.error(` Failed to update ticket: ${errorText || res.statusText}`, { id: loadingToastId });
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error(" An unexpected error occurred.", { id: loadingToastId });
    }
  };

  if (loading || !id)
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-600 text-lg font-semibold">
        Loading ticket...
      </div>
    );

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-6">
      {/* 👈 CRITICAL: Add the Toaster component */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-blue-900  mt-4 text-center">
          Edit Support Ticket
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 p-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={ticket.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={ticket.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={ticket.priority}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => router.push("/view-tickets")}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Update Ticket
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}