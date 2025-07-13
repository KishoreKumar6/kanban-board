import React, { useState } from "react";
import { toast } from "react-toastify";

export default function EditTask({ task, setTasks, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assignee);
  const [label, setLabel] = useState(task.label);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate?.split("T")[0] || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      title,
      description,
      assignee,
      label,
      priority,
      dueDate,
    };

    try {
      const res = await fetch(`https://kanbanboard-mt64.onrender.com/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();

      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      toast.success(`✅ Task "${data.title}" updated`);
      onClose();
    } catch (err) {
      toast.error(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-300 text-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6">✏️ Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder-gray-500 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assignee"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Urgent">Urgent</option>
            <option value="Feature">Feature</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">🌿 Low</option>
            <option value="Medium">⚡ Medium</option>
            <option value="High">🔥 High</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
