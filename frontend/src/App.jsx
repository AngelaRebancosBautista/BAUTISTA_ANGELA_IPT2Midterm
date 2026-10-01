import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Gets all tasks from the Express backend.
  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks.");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError("Unable to load tasks. Check if the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  // Deletes a task through the backend API.
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task.");
      }

      fetchTasks();
    } catch (error) {
      setError("Unable to delete task.");
    }
  }

  // Refreshes the task list after adding or updating a task.
  function handleTaskSaved() {
    setEditingTask(null);
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Task Manager</h1>
          <p>Manage your tasks easily and efficiently.</p>
        </div>
      </header>

      <main className="container">
        <TaskForm
          onTaskSaved={handleTaskSaved}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <section className="tasks-section">
          <div className="section-title">
            <h2>My Tasks</h2>
            <span>{tasks.length} task(s)</span>
          </div>

          {loading && (
            <div className="loading">
              <p>Loading tasks...</p>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          {!loading && (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;