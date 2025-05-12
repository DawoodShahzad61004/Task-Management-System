const { sql, poolPromise } = require("../config/db");
global.loggedInUser = null;
global.loggedInUserMail = null;
global.loggedInUserRole = null;

// Login procedure
exports.login = async (username, password) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("email", sql.NVarChar, username)
      .input("password", sql.NVarChar, password)
      .execute("login");
    console.log("Stored procedure result:", result);
    return result.recordset[0].RoleID;
  } catch (err) {
    console.error("Error in login:", err);
    throw err;
  }
};

exports.userDetails = async userId => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("userId", sql.Int, userId);
    request.input("userRole", sql.Int, global.loggedInUserRole);

    // console.log("Parameters passed to GetUserDetails stored procedure:", {
    //   userId,
    //   userRole: global.loggedInUserRole
    // });
    const result = await request.execute("GetUserDetails");

    // console.log("Stored procedure result:", result);
    return result.recordset[0]; // Return the first record
  } catch (error) {
    console.error("Error in userDetails:", error);
    throw error;
  }
};
// Get admin details
exports.getAdminDetails = async (adminId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("admin_id", sql.Int, adminId)
    .execute("getAdminInfo"); // updated name
  return result.recordset[0];
};

// Check user role
exports.checkUser = async userId => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("email", sql.NVarChar, global.loggedInUserMail);
    request.input("userId", sql.Int, userId);

    const result = await request.execute("CheckUserRole");
    global.loggedInUserRole = result.returnValue;
    return result.returnValue; // Can be 1 (admin), 0 (employee), -1 (not found)
  } catch (error) {
    console.error("Error in checkUser:", error);
    throw error;
  }
};

// Create a new task
exports.newTask = async (title, description, dueDate, priority, assignedTo) => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 1) {
      throw new Error("Not Logged-in as Admin");
    }
    // console.log("Parameters passed to new_task stored procedure:", {
    //   title,
    //   description,
    //   dueDate,
    //   priority,
    //   status: "Pending",
    //   loggedInUser: global.loggedInUser,
    //   employee_email: assignedTo
    // });
    const result = await pool
      .request()
      .input("title", sql.VarChar, title)
      .input("description", sql.VarChar, description)
      .input("deadline", sql.Date, dueDate)
      .input("priority", sql.VarChar, priority)
      .input("status", sql.VarChar, "Pending") // Default status
      .input("admin_id", sql.Int, global.loggedInUser)
      .input("employee_email", sql.VarChar, assignedTo)
      .execute("new_task");
    if (result.returnValue == 1) {
      return { message: "Task created successfully" };
    }
    // console.log("Stored procedure result:", result);
    return { message: "Task creation failed - No such employee exists" };
  } catch (err) {
    console.error("Error in newTask:", err);
    throw err;
  }
};

// Update task status
exports.updateStatus = async (taskId, status) => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 1) {
      throw new Error("Not Logged-in as Admin");
    }
    const result = await pool
      .request()
      .input("adminId", sql.Int, global.loggedInUser)
      .input("new_status", sql.VarChar, status)
      .input("orderID", sql.Int, taskId)
      .execute("update_status");
    if (result.returnValue == 1) {
      return { message: "Status updated successfully" };
    } else if (result.returnValue == -1) {
      return { message: "Order id is not found" };
    } else if (result.returnValue == 0) {
      return {
        message: "Access Denied: You can only update orders assigned by you."
      };
    }
  } catch (err) {
    console.error("Error in updateStatus:", err);
    throw err;
  }
};

// Update task priority
exports.updatePriority = async (taskId, priority) => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 1) {
      throw new Error("Not Logged-in as Admin");
    }
    // console.log("Parameters passed to update_priority stored procedure:", {
    //   loggedInUser: global.loggedInUser,
    //   new_priority: priority,
    //   order_id: taskId
    // });
    const result = await pool
      .request()
      .input("adminId", sql.Int, global.loggedInUser)
      .input("new_priority", sql.VarChar, priority)
      .input("order_id", sql.Int, taskId)
      .execute("update_priority");
    if (result.returnValue == 1)
      return { message: "Priority updated successfully" };
    else if (result.returnValue == -1)
      return { message: "Order id is not found" };
    else if (result.returnValue == 0)
      return {
        message: "Access Denied: You can only update orders assigned by you."
      };
    else if (result.returnValue == -2) return { message: "Invalid priority" };
  } catch (err) {
    console.error("Error in updatePriority:", err);
    throw err;
  }
};

// Search tasks by status
exports.statusSearch = async status => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 1) {
      throw new Error("Not Logged-in as Admin");
    }
    // console.log("Parameters passed to status_search stored procedure:", {
    //   loggedInUser: global.loggedInUser,
    //   Sstatus: status
    // });
    const result = await pool
      .request()
      .input("adminId", sql.Int, global.loggedInUser)
      .input("Sstatus", sql.VarChar, status)
      .execute("status_search");
    return result.recordset;
  } catch (err) {
    console.error("Error in statusSearch:", err);
    throw err;
  }
};

// Search tasks by date
exports.dateSearch = async toDate => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 1) {
      throw new Error("Not Logged-in as Admin");
    }
    const result = await pool
      .request()
      .input("Ddate", sql.Date, toDate)
      .input("adminID", sql.Int, global.loggedInUser)
      .execute("date_search");
    //console.log("Stored procedure result:", result);
    return result.recordset;
  } catch (err) {
    console.error("Error in dateSearch:", err);
    throw err;
  }
};

// Search tasks by employee
exports.employeeSearch = async employeeId => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 1) {
      throw new Error("Not Logged-in as Admin");
    }
    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .input("adminID", sql.Int, global.loggedInUser)
      .execute("employee_search");
    return result.recordset;
  } catch (err) {
    console.error("Error in employeeSearch:", err);
    throw err;
  }
};

// Employee updating task status
exports.empUpdateStatus = async (taskId, status) => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 0) {
      throw new Error("Not Logged-in as Employee");
    }
    const result = await pool
      .request()
      .input("employeeId", sql.Int, global.loggedInUser) // Use the global variable for employeeId
      .input("new_status", sql.VarChar, status)
      .input("orderID", sql.Int, taskId)
      .execute("Emp_update_status");
    // console.log("Parameters passed to Emp_update_status stored procedure:", {
    //   loggedInUser: global.loggedInUser,
    //   new_status: status,
    //   orderID: taskId
    // });
    // console.log("Stored procedure result:", result);

    if (result.returnValue == 1)
      return { message: "Order status updated successfully" };
    else if (result.returnValue == -1)
      return { message: "Order id is not found" };
    else if (result.returnValue == 0)
      return {
        message: "Access Denied: You can only update orders assigned to you."
      };
    else if (result.returnValue == -2)
      return {
        message:
          "Invalid status value. It should be In Pending, Progress, Completed or Cancelled."
      };
  } catch (err) {
    console.error("Error in empUpdateStatus:", err);
    throw err;
  }
};

// Employee task search by status = 'In Progress'
exports.empStatusSearch = async () => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 0) {
      throw new Error("Not Logged-in as Employee");
    }
    const result = await pool
      .request()
      .input("employeeId", sql.Int, global.loggedInUser)
      .execute("Emp_status_search");
    //console.log(result);
    return result.recordset;
  } catch (err) {
    console.error("Error in empStatusSearch:", err);
    throw err;
  }
};

//  Employee task search by status = 'Pending'
exports.empPStatusSearch = async () => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 0) {
      throw new Error("Not Logged-in as Employee");
    }
    const result = await pool
      .request()
      .input("employeeId", sql.Int, global.loggedInUser)
      .execute("Emp_Pstatus_search");
    //console.log(result);
    return result.recordset;
  } catch (err) {
    console.error("Error in empPStatusSearch:", err);
    throw err;
  }
};

// Accept/Decline task status
exports.acpDecStatus = async (taskId, decision) => {
  try {
    const pool = await poolPromise;
    const userRole = await this.checkUser(global.loggedInUser);
    if (userRole != 0) {
      throw new Error("Not Logged-in as Employee");
    }
    const result = await pool
      .request()
      .input("employeeID", sql.Int, global.loggedInUser)
      .input("orderID", sql.Int, taskId)
      .input("claim", sql.NVarChar, decision) // e.g., 'accept' or 'decline'
      .execute("acp_dec_status");
    if (result.returnValue == 1) {
      return { message: "Order Accepted successfully" };
    } else if (result.returnValue == -1) {
      return { message: "Order ID is not found" };
    } else if (result.returnValue == -2) {
      return {
        message: "Access Denied: You can only accept orders assigned to you."
      };
    } else if (result.returnValue == -3) {
      return {
        message:
          "Invalid decision value. It should be either Accept or Decline."
      };
    } else if (result.returnValue == 0) {
      return { message: "Order Declined successfully" };
    }
    return { message: "Decision updated successfully" };
  } catch (err) {
    console.error("Error in acpDecStatus:", err);
    throw err;
  }
};

exports.getEmployees = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute("getNonAdminEmployees");
    return result.recordset;
  } catch (error) {
    console.error("Error in getEmployees:", error);
    throw error;
  }
};
