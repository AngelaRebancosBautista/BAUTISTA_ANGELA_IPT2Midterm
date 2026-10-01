const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve tasks"
    });
  }
});

// GET one task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve task"
    });
  }
});

// CREATE a task
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate
    } = req.body;

    // Basic validation
    if (!title || !description || !dueDate) {
      return res.status(400).json({
        message: "Title, description, and due date are required"
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "Pending",
      priority: priority || "Medium",
      dueDate
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create task"
    });
  }
});

// UPDATE a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task"
    });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task"
    });
  }
});

// IMPORTANT:
// Export the router so server.js can use it.
module.exports = router;
