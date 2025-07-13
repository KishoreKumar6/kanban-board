import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Column from "./Column";
import AddTask from "./AddTask";
import EditTask from "./EditTask";

const API_BASE = "https://kanbanboard-mt64.onrender.com/api";
const DEFAULT_COLUMNS = ["To Do", "In Progress", "Done"];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("Board");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("To Do");
  const [editTask, setEditTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const navigate = useNavigate();

  // Check login token and redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login", { replace: true });
    }

    // Disable back navigation to login page
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };

    return () => {
      window.onpopstate = null;
    };
  }, [navigate]);

  // Fetch tasks
  useEffect(() => {
    fetch(`${API_BASE}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  // Fetch columns
  useEffect(() => {
    fetch(`${API_BASE}/columns`)
      .then((res) => res.json())
      .then((allCols) => {
        const uniqueCols = Array.from(
          new Set([...DEFAULT_COLUMNS, ...allCols])
        );
        setColumns(uniqueCols);
      })
      .catch(console.error);
  }, []);

  // Sync dark mode with localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const moveTask = (id, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task._id === id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(console.error);
  };

  const handleAddSection = async () => {
    const name = prompt("New section name:");
    if (!name || columns.includes(name)) return;

    try {
      const res = await fetch(`${API_BASE}/columns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setColumns((prev) => [...prev, name]);
    } catch (err) {
      toast.error(`Failed to add section: ${err.message}`);
    }
  };

  const handleOpenModal = (status) => {
    setSelectedStatus(status);
    setShowAddModal(true);
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        <div className="min-h-screen px-6 py-8 transition-colors duration-300 overflow-x-hidden relative">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
          />

          {/* Header */}
          <div className="absolute top-6 left-6 flex items-center gap-4 z-50">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${
                  darkMode ? "bg-purple-400" : "bg-purple-600"
                } text-white flex items-center justify-center rounded-full font-bold shadow`}
              >
                T
              </div>
              <span className="text-lg font-semibold">Kanban-TaskBoard</span>
            </div>
          </div>

          <div className="absolute top-6 right-6 flex gap-4 z-50">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow"
            >
              Logout
            </button>
          </div>

          <div
            className={`max-w-7xl mx-auto p-10 rounded-2xl shadow-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            {/* Page Title */}
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold">Tasks</h1>
              <p className="mt-2 text-sm">
                Keep track of your team's tasks all in one place.
              </p>

              {/* View Tabs */}
              <div className="mt-6 inline-flex border-b text-sm font-medium">
                {["Board", "List", "Table"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setView(tab)}
                    className={`px-4 py-2 transition relative ${
                      view === tab
                        ? `${darkMode ? "text-white" : "text-gray-900"}`
                        : `${
                            darkMode
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-500 hover:text-gray-700"
                          }`
                    }`}
                  >
                    {tab}
                    {view === tab && (
                      <div
                        className={`absolute bottom-0 left-0 w-full h-[2px] ${
                          darkMode ? "bg-purple-400" : "bg-purple-500"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`px-4 py-2 rounded-xl border shadow-sm w-full md:w-64 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                />
                <button
                  onClick={handleAddSection}
                  className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 font-semibold"
                >
                  + Add Section
                </button>
              </div>
            </div>

            {/* Views */}
            {view === "Board" && (
              <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                {columns.map((col) => (
                  <Column
                    key={col}
                    title={col}
                    tasks={filteredTasks.filter((task) => task.status === col)}
                    moveTask={moveTask}
                    openAddModal={handleOpenModal}
                    setTasks={setTasks}
                    onEditClick={handleEditClick}
                    darkMode={darkMode}
                    columns={columns}
                    setColumns={setColumns}
                  />
                ))}
              </div>
            )}

            {view === "List" && (
              <div className="grid gap-6">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`p-5 border rounded-lg shadow ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-1">{task.title}</h3>
                    <p className="mb-2">{task.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Status:</strong> {task.status}
                      </div>
                      <div>
                        <strong>Due Date:</strong> {task.dueDate?.split("T")[0]}
                      </div>
                      <div>
                        <strong>Assignee:</strong> {task.assignee || "—"}
                      </div>
                      <div>
                        <strong>Label:</strong> {task.label}
                      </div>
                      <div>
                        <strong>Priority:</strong> {task.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === "Table" && (
              <div className="overflow-x-auto">
                <table
                  className={`w-full border-collapse shadow-lg ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                    <tr>
                      {[
                        "Title",
                        "Description",
                        "Status",
                        "Due Date",
                        "Assignee",
                        "Label",
                        "Priority",
                      ].map((h) => (
                        <th key={h} className="border px-4 py-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr
                        key={task._id}
                        className={
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }
                      >
                        <td className="border px-4 py-2">{task.title}</td>
                        <td className="border px-4 py-2">{task.description}</td>
                        <td className="border px-4 py-2">{task.status}</td>
                        <td className="border px-4 py-2">
                          {task.dueDate?.split("T")[0]}
                        </td>
                        <td className="border px-4 py-2">
                          {task.assignee || "—"}
                        </td>
                        <td className="border px-4 py-2">{task.label}</td>
                        <td className="border px-4 py-2">{task.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modals */}
          {showAddModal && (
            <AddTask
              status={selectedStatus}
              setTasks={setTasks}
              onClose={() => setShowAddModal(false)}
            />
          )}
          {showEditModal && editTask && (
            <EditTask
              task={editTask}
              setTasks={setTasks}
              onClose={() => {
                setEditTask(null);
                setShowEditModal(false);
              }}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
