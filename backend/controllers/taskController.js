const taskModel = require("../models/taskModel");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await taskModel.login(email, password);
    if (result) {
      global.loggedInUser = result;

      global.loggedInUserMail = email;
      global.loggedInUserRole = await taskModel.checkUser(global.loggedInUser);
      if (global.loggedInUserRole != 1 && global.loggedInUserRole != 0) {
        throw new Error("Invalid credentials");
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.getAdminDetails = async (req, res) => {
  try {
    const { admin_id } = req.body;

    if (!admin_id) {
      return res.status(400).json({ error: "admin_id is required" });
    }

    const result = await taskModel.getAdminDetails(admin_id);

    if (!result) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getAdminDetails:", error);
    res.status(500).json({ error: "Failed to fetch admin details" });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const userId = global.loggedInUser;
    const result = await taskModel.userDetails(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in userDetails:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

exports.checkUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const roleId = await taskModel.checkUser(userId);

    res.status(200).json({ roleId });
  } catch (error) {
    console.error("Error in checkUser:", error);
    res.status(500).json({ error: "Failed to check user role" });
  }
};

exports.newTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const result = await taskModel.newTask(
      title,
      description,
      dueDate,
      priority,
      assignedTo
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in newTask:", error);
    res.status(500).json({ error: "Failed to create new task" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const result = await taskModel.updateStatus(taskId, status);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

exports.updatePriority = async (req, res) => {
  try {
    const { taskId, priority } = req.body;
    const result = await taskModel.updatePriority(taskId, priority);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in updatePriority:", error);
    res.status(500).json({ error: "Failed to update priority" });
  }
};

exports.statusSearch = async (req, res) => {
  try {
    const { status } = req.query;
    const result = await taskModel.statusSearch(status);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in statusSearch:", error);
    res.status(500).json({ error: "Failed to search by status" });
  }
};

exports.dateSearch = async (req, res) => {
  try {
    const { toDate } = req.query;
    const result = await taskModel.dateSearch(toDate);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in dateSearch:", error);
    res.status(500).json({ error: "Failed to search by date" });
  }
};

exports.employeeSearch = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const result = await taskModel.employeeSearch(parseInt(employeeId));
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in employeeSearch:", error);
    res.status(500).json({ error: "Failed to search by employee" });
  }
};

exports.empUpdateStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const result = await taskModel.empUpdateStatus(taskId, status);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in empUpdateStatus:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

exports.empStatusSearch = async (req, res) => {
  try {
    const result = await taskModel.empStatusSearch();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in empStatusSearch:", error);
    res
      .status(500)
      .json({ error: "Failed to search employee tasks by status" });
  }
};

exports.empPStatusSearch = async (req, res) => {
  try {
    const result = await taskModel.empPStatusSearch();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in empPStatusSearch:", error);
    res
      .status(500)
      .json({ error: "Failed to search employee tasks by partial status" });
  }
};

exports.acpDecStatus = async (req, res) => {
  try {
    const { taskId, decision } = req.body;
    const result = await taskModel.acpDecStatus(taskId, decision);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in acpDecStatus:", error);
    res.status(500).json({ error: "Failed to process decision" });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await taskModel.getEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

exports.deleteOrderAndUpdateStats = async (req, res) => {
  const { orderId } = req.params;

  try {
    if (global.loggedInUserRole != 1) 
      return res.status(403).json({ error: "Forbidden" });
    
    const result = await taskModel.deleteOrderAndUpdateStats(orderId);
    
    res.status(200).json({ message: "Order deleted and stats updated", result });
  } catch (error) {
    console.error("Error deleting order and updating stats:", error);
    res.status(500).json({ error: "Failed to delete order or update stats" });
  }
};
