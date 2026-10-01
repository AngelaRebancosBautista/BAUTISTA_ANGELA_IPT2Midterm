function TaskList({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-message">
        <p>No tasks found.</p>
        <span>Add your first task above.</span>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-card" key={task._id}>
          <div className="task-header">
            <h3>{task.title}</h3>
            <span className={`priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>

          <p>{task.description}</p>

          <div className="task-details">
            <span>Status: {task.status}</span>
            <span>Due: {task.dueDate}</span>
          </div>

          <div className="task-actions">
            <button onClick={() => onEdit(task)}>Edit</button>

            <button
              className="delete-button"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;