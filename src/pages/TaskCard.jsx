import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { toast } from "react-toastify";

export default function TaskCard({ task, onEditClick, onDelete, darkMode }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://kanbanboard-mt64.onrender.com/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const contentType = res.headers.get("Content-Type");
      if (!res.ok) {
        if (contentType?.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.message || "Failed to delete task");
        } else {
          throw new Error("Server error. Check logs.");
        }
      }

      onDelete(task._id);
      toast.success(`🗑️ Deleted "${task.title}"`);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
      console.error("Delete error:", err.message);
    }
  };

  const labelColors = {
    General: "bg-green-100 text-green-800 border-green-300",
    Urgent: "bg-orange-100 text-orange-800 border-orange-300",
    Feature: "bg-red-100 text-red-800 border-red-300",
  };

  const labelClass = labelColors[task.label] || "";

  return (
    <div
      ref={dragRef}
      className={`relative group rounded-lg p-4 min-h-[120px] shadow-md border transition-transform hover:scale-[1.02] ${
        darkMode
          ? "bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700"
          : "bg-white/90 text-gray-800 border-white/50 hover:bg-white"
      } ${isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"}`}
    >
      {/* Menu */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`text-base ${
            darkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ⋯
        </button>
        {menuOpen && (
          <div
            className={`absolute right-0 mt-1 w-28 text-sm rounded-md shadow-lg border p-2 z-30 space-y-1 ${
              darkMode
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-black/70 text-white border-white/20"
            }`}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                onEditClick(task);
              }}
              className="w-full text-left px-2 py-1 hover:bg-white/20 rounded"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleDelete();
              }}
              className="w-full text-left px-2 py-1 hover:bg-white/20 rounded"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold mb-1 pr-6">{task.title}</h3>

      {/* Description */}
      <p
        className={`text-sm mb-2 truncate ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {task.description}
      </p>

      {/* Metadata */}
      <div
        className={`text-xs mt-2 space-y-1 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <div>
          <p>📅 Due: {task.dueDate?.split("T")[0]}</p>
          <p>🙍 Assignee: {task.assignee || "—"}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className={`text-xs px-2 py-0.5 rounded border ${labelClass}`}>
            {task.label || "—"}
          </span>
          <span
            className={`font-medium ${
              task.priority === "High"
                ? "text-red-600"
                : task.priority === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            Priority: {task.priority || "Low"}
          </span>
        </div>
      </div>
    </div>
  );
}
