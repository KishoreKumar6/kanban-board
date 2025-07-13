// src/pages/AddTask.jsx
import React, { useState } from "react";

export default function AddTask({ status, setTasks, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
    priority: "Medium",
    label: "General",
    status,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://kanbanboard-mt64.onrender.com/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      onClose();
    } catch (err) {
      console.error("Task creation error:", err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-xl p-6 w-full max-w-sm shadow-xl border border-gray-300 text-gray-800">
        <h2 className="text-xl font-bold mb-5 text-center">
          📝 Create New Task
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Assignee"
            value={form.assignee}
            onChange={(e) => handleChange("assignee", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={form.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="High">🔥 High</option>
            <option value="Medium">⚡ Medium</option>
            <option value="Low">🌿 Low</option>
          </select>
          <select
            value={form.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Urgent">Urgent</option>
            <option value="Feature">Feature</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Add Task
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
