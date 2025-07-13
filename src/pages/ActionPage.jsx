import React, { useEffect, useState } from "react";

const API_BASE = "https://kanbanboard-mt64.onrender.com/api";

export default function ActionPage() {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/tasks/actions`)
      .then((res) => res.json())
      .then(setActions)
      .catch((err) => console.error("Failed to load actions", err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🕵️ Action History
      </h1>
      <table className="min-w-full border-collapse shadow-lg bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">User Email</th>
            <th className="px-4 py-2 border">Action</th>
            <th className="px-4 py-2 border">Task Title</th>
            <th className="px-4 py-2 border">Changes</th>
            <th className="px-4 py-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 border">{a.userEmail}</td>
              <td className="px-4 py-2 border">{a.actionType}</td>
              <td className="px-4 py-2 border">
                {a.taskId?.title || "Deleted Task"}
              </td>
              <td className="px-4 py-2 border text-xs">
                {a.actionType === "EDIT" ? (
                  <>
                    <strong>Before:</strong> {a.changes.before?.title}
                    <br />
                    <strong>After:</strong> {a.changes.after?.title}
                  </>
                ) : (
                  <span>{a.changes.before?.title}</span>
                )}
              </td>
              <td className="px-4 py-2 border">
                {new Date(a.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
