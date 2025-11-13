"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // 👈 Import Toaster

export default function AddTicketPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚩 CLIENT-SIDE VALIDATION FOR DESCRIPTION MIN LENGTH (10 chars)
    if (formData.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long.");
      return; // Stop the form submission
    }
    
    // 🚩 CLIENT-SIDE VALIDATION FOR TITLE MIN LENGTH (3 chars)
    if (formData.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters long.");
      return; // Stop the form submission
    }


    const loadingToast = toast.loading("Submitting ticket..."); // Show loading state

    try {
      const res = await fetch("/api/add-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Replace loading toast with success
        toast.success("Ticket created successfully!", { id: loadingToast });
        router.push("/view-tickets");
      } else {
        // If the backend returns a specific error (e.g., Mongoose validation error)
        // You would typically read the response body here to show a more detailed error.
        const errorData = await res.json();
        const errorMessage = errorData.message || "Failed to create ticket.";
        toast.error(errorMessage, { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", { id: loadingToast });
    }
  };

  return (
    <section className="min-h-[85vh] bg-gray-50 py-12 px-4 flex items-center justify-center mt-8">
      {/* 👈 Add Toaster component */}
      <Toaster position="top-center" reverseOrder={false} /> 

      {/* ✅ Reduced width and padding */}
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6 md:p-8 mt-5">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">
          Create New Support Ticket
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter ticket title (Min 3 characters)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe the issue or request (Min 10 characters)..."
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            {/* Status field is not editable here, keeping the layout simple */}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-300"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </section>
  );
}