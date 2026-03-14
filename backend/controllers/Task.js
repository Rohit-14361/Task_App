const Task = require("../models/task.model");
const User = require("../models/user.model");

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status = "pending" } = req.body;
    if (!title || !description || !["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Title, description required. Status must be pending/in-progress/completed",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      user: userId
    });

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { task: newTask._id }
    }, { new: true }).select('-password').populate({
      path:"task"
    }).exec();

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID required.",
      });
    }
    const { title, description, status } = req.body;
    if (!title || !description || !status || !["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Title, description, status required. Status must be pending/in-progress/completed.",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    // verify user is valid or authorized to update the task or not.s
    if (task.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task.",
      });
    }

    task.title = title;
    task.description = description;
    task.status = status;
    await task.save();

    const updatedUser = await User.findById(userId).populate({ 
      path: "task",
      select:"-password" 
    }).exec();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task,
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID required.",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task.",
      });
    }

    await Task.findByIdAndDelete(taskId);
    await User.findByIdAndUpdate(userId, {
      $pull: { task: taskId }
    });

    const updatedUser = await User.findById(userId).populate({ 
      path: "task", 
      select: '-password'  
    });

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the task. Please try again later!",
    });
  }
};

// Get all user tasks with pagination, filter, search
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let tasksQuery = { user: userId };
    if (status) tasksQuery.status = status;
    if (search) {
      tasksQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(tasksQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(tasksQuery);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully.",
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the tasks. Please try again later!"
    });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.taskId;

    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not authorized."
      });
    }

    return res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the task. Please try again later!"
    });
  }
};
