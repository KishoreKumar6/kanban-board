import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { useDrop } from "react-dnd";
import { toast } from "react-toastify";

const API_BASE = "https://kanbanboard-mt64.onrender.com/api";

export default function Column({
  title,
  tasks,
  moveTask,
  openAddModal,
  setTasks,
  onEditClick,
  darkMode,
  columns,
  setColumns,
}) {
  const [, dropRef] = useDrop({
    accept: "TASK",
    drop: (item) => moveTask(item.id, title),
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  // UPDATE COLUMN NAME
  const handleUpdate = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === title || columns.includes(trimmed)) {
      toast.error("Invalid or duplicate name.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/columns/${encodeURIComponent(title)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName: trimmed }),
        }
      );

      if (!res.ok) throw new Error("Rename failed");

      setColumns((prev) => prev.map((col) => (col === title ? trimmed : col)));
      setTasks((prev) =>
        prev.map((task) =>
          task.status === title ? { ...task, status: trimmed } : task
        )
      );
      toast.success(`Renamed "${title}" to "${trimmed}"`);
      setEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // DELETE COLUMN
  const handleDelete = async () => {
    const confirm = window.confirm(`Delete column "${title}" and its tasks?`);
    if (!confirm) return;

    try {
      const res = await fetch(
        `${API_BASE}/columns/${encodeURIComponent(title)}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setColumns((prev) => prev.filter((col) => col !== title));
      setTasks((prev) => prev.filter((task) => task.status !== title));
      toast.success(`Deleted "${title}"`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      ref={dropRef}
      className={`w-[260px] h-[800px] flex-shrink-0 rounded-xl p-4 shadow-md overflow-y-auto transition-transform hover:scale-[1.01] ${
        darkMode
          ? "bg-gray-900 text-white border border-gray-700"
          : "bg-gray-100 text-gray-800 border border-gray-300"
      }`}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-lg font-bold truncate">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal(title)}
            className={`text-xs font-semibold transition ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-500 hover:text-blue-600"
            }`}
          >
            + Add
          </button>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`text-lg px-1 transition ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ⋮
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              className={`absolute top-10 right-4 z-40 w-32 rounded-md shadow-lg border p-2 text-sm ${
                darkMode
                  ? "bg-gray-900 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setEditing(true);
                }}
                className="w-full text-left px-2 py-1 hover:bg-white/10 rounded"
              >
                ✏️ Edit Section
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleDelete();
                }}
                className="w-full text-left px-2 py-1 hover:bg-white/10 rounded"
              >
                🗑️ Delete Section
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-80 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h3 className="text-lg font-semibold mb-3">Edit Column Title</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded border mb-4 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-500"
                  : "bg-white text-black border-gray-300"
              }`}
              placeholder="New title"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            darkMode={darkMode}
            onEditClick={onEditClick}
            onDelete={(id) =>
              setTasks((prev) => prev.filter((t) => t._id !== id))
            }
          />
        ))}
      </div>
    </div>
  );
}
