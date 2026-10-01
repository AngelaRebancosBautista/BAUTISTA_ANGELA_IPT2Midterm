import { useEffect, useState } from "react";

function TaskForm({ onTaskSaved, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  // Loads the selected task information into the form when editing.
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
    } else {
      clearForm();
    }
  }, [editingTask]);

  function clearForm() {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setPriority("Medium");
    setDueDate("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !dueDate) {
      setError("Please complete all required fields.");
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate
    };

    try {
      const url = editingTask
        ? `http://localhost:5000/api/tasks/${editingTask._id}`
        : "http://localhost:5000/api/tasks";

      const method = editingTask ? "put" : "post";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error("Failed to save task.");
      }

      await response.json();

      clearForm();
      onTaskSaved();
    } catch (error) {
      setError("Unable to save task. Please try again.");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

      {error && <p className="error-message">{error}</p>}

      <label>Task Title</label>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter task title"
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Enter task description"
      />

      <div className="form-row">
        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label>Priority</label>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      <div className="button-group">
        <button type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;