"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function ViewTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/get-tickets");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the actual API deletion
  const executeDelete = async (id: string, loadingToastId: string) => {
    try {
      const res = await fetch(`/api/delete-ticket/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTickets((prevTickets) => prevTickets.filter((t) => t._id !== id));
        toast.success(" Ticket deleted successfully!", {
          id: loadingToastId,
        });
      } else {
        toast.error(" Failed to delete ticket", { id: loadingToastId });
      }
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error(" An error occurred while deleting the ticket", {
        id: loadingToastId,
      });
    }
  };

  // Delete a ticket - shows confirmation toast
  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-3">
          <p className="font-semibold text-gray-800">
            ⚠️ Are you sure you want to delete this ticket?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition"
              onClick={() => {
                toast.dismiss(t.id);
                const loadingToastId = toast.loading("Deleting ticket...");
                executeDelete(id, loadingToastId);
              }}
            >
              Yes, Delete
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm font-medium transition"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-blue-600 text-xl font-semibold">
        Loading tickets...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          All Support Tickets
        </h1>

        {tickets.length === 0 ? (
          <p className="text-center text-gray-600">No tickets found.</p>
        ) : (
          <>
            {/* ✅ TABLE VIEW (Desktop & Tablets) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg table-fixed">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="py-3 px-4 text-left w-1/5">Title</th>
                    <th className="py-3 px-4 text-left w-2/5">Description</th>
                    <th className="py-3 px-4 text-left w-[10%]">Priority</th>
                    <th className="py-3 px-4 text-left w-[20%]">Created At</th>
                    <th className="py-3 px-4 text-center w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="py-3 px-4 truncate">{ticket.title}</td>
                      <td className="py-3 px-4 text-sm whitespace-normal break-words">
                        {ticket.description}
                      </td>
                      <td
                        className={`py-3 px-4 font-medium ${
                          ticket.priority === "High"
                            ? "text-red-600"
                            : ticket.priority === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {ticket.priority}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-3">
                        <button
                          onClick={() => router.push(`/edit-ticket/${ticket._id}`)}
                          className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                          title="Edit Ticket"
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(ticket._id)}
                          className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                          title="Delete Ticket"
                        >
                          <FaTrashAlt size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ CARD VIEW (Mobile) */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg text-blue-800">
                      {ticket.title}
                    </h2>
                    <span
                      className={`text-sm font-medium ${
                        ticket.priority === "High"
                          ? "text-red-600"
                          : ticket.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 break-words">
                    {ticket.description}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/edit-ticket/${ticket._id}`)}
                        className="text-gray-500 hover:text-blue-700"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(ticket._id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
