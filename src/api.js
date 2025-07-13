import axios from "axios";

const API = axios.create({
  baseURL: "https://kanbanboard-mt64.onrender.com", // Your backend URL
});

export const fetchTasks = () => API.get("/tasks");
export const createTask = (task) => API.post("/tasks", task);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
