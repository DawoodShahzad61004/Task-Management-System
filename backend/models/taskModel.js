const { sql, poolPromise } = require('../config/db');
global.loggedInUser = null;


// Login procedure
exports.login = async (username, password) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .execute('login');
    return result.recordset;
  } catch (err) {
    console.error('Error in login:', err);
    throw err;
  }
};

// Create a new task
exports.newTask = async (title, description, assignedTo, priority, dueDate) => {
  try {
    const pool = await poolPromise;
    const assignedBy = global.loggedInUser; // Use the global variable for assignedBy
    if (!assignedBy) {
      throw new Error('User not logged in');
    }
    await pool.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('dueDate', sql.Date, dueDate)
      .input('priority', sql.NVarChar, priority)
      .input('assignedBy', sql.Int, assignedBy) 
      .input('assignedTo', sql.Int, assignedTo)
      .execute('new_task');
    return { message: 'Task created successfully' };
  } catch (err) {
    console.error('Error in newTask:', err);
    throw err;
  }
};

// Update task status
exports.updateStatus = async (taskId, status) => {
  try {
    const pool = await poolPromise;
    const adminId = global.loggedInUser; // Use the global variable
    if (!adminId) {
      throw new Error('User not logged in');
    }
    await pool.request()
      .input('adminId', sql.Int, adminId)
      .input('status', sql.NVarChar, status)
      .input('taskId', sql.Int, taskId)
      .execute('update_status');
    return { message: 'Status updated successfully' };
  } catch (err) {
    console.error('Error in updateStatus:', err);
    throw err;
  }
};

// Update task priority
exports.updatePriority = async (taskId, priority) => {
  try {
    const pool = await poolPromise;
    const adminId = global.loggedInUser; // Use the global variable
    if (!adminId) {
      throw new Error('User not logged in');
    }
    await pool.request()
      .input('adminId', sql.Int, adminId)
      .input('priority', sql.NVarChar, priority)
      .input('taskId', sql.Int, taskId)
      .execute('update_priorty');
    return { message: 'Priority updated successfully' };
  } catch (err) {
    console.error('Error in updatePriority:', err);
    throw err;
  }
};

// Search tasks by status
exports.statusSearch = async (status) => {
  try {
    const pool = await poolPromise;
    const adminId = global.loggedInUser; // Use the global variable
    if (!adminId) {
      throw new Error('User not logged in');
    }
    const result = await pool.request()
      .input('status', sql.NVarChar, status)
      .input('adminId', sql.Int, adminId)
      .execute('status_search');
    return result.recordset;
  } catch (err) {
    console.error('Error in statusSearch:', err);
    throw err;
  }
};

// Search tasks by date
exports.dateSearch = async (toDate) => {
  try {
    const pool = await poolPromise;
    const adminId = global.loggedInUser; // Use the global variable
    if (!adminId) {
      throw new Error('User not logged in');
    }
    const result = await pool.request()
      .input('toDate', sql.Date, toDate)
      .input('adminId', sql.Int, adminId)
      .execute('date_search');
    return result.recordset;
  } catch (err) {
    console.error('Error in dateSearch:', err);
    throw err;
  }
};

// Search tasks by employee
exports.employeeSearch = async (employeeId) => {
  try {
    const pool = await poolPromise;
    const adminId = global.loggedInUser; // Use the global variable
    if (!assignedBy) {
      throw new Error('User not logged in');
    }
    const result = await pool.request()
      .input('employeeId', sql.Int, employeeId)
      .input('adminId', sql.Int, adminId) 
      .execute('employee_search');
    return result.recordset;
  } catch (err) {
    console.error('Error in employeeSearch:', err);
    throw err;
  }
};

// Employee updating task status
exports.empUpdateStatus = async (taskId, status) => {
  try {
    const pool = await poolPromise;
    const employeeId = global.loggedInUser; // Use the global variable
    if (!employeeId) {
      throw new Error('User not logged in');
    }
    await pool.request()
      .input('employeeId', sql.Int, employeeId) // Use the global variable for employeeId
      .input('status', sql.NVarChar, status)
      .input('taskId', sql.Int, taskId)
      .execute('Emp_update_status');
    return { message: 'Employee status updated successfully' };
  } catch (err) {
    console.error('Error in empUpdateStatus:', err);
    throw err;
  }
};

// Employee task search by status = 'In Progress'
exports.empStatusSearch = async (employeeId) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employeeId', sql.Int, employeeId)
      .execute('Emp_status_search');
    return result.recordset;
  } catch (err) {
    console.error('Error in empStatusSearch:', err);
    throw err;
  }
};

//  Employee task search by status = 'Pending'
exports.empPStatusSearch = async (employeeId) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('employeeId', sql.Int, employeeId)
      .execute('Emp_Pstatus_search');
    return result.recordset;
  } catch (err) {
    console.error('Error in empPStatusSearch:', err);
    throw err;
  }
};

// Accept/Decline task status
exports.acpDecStatus = async (taskId, decision) => {
  try {
    const pool = await poolPromise;
    const employeeId = global.loggedInUser; // Use the global variable
    if (!employeeId) {
      throw new Error('User not logged in');
    }
    await pool.request()
      .input('employeeId', sql.Int, employeeId)
      .input('taskId', sql.Int, taskId)
      .input('decision', sql.NVarChar, decision) // e.g., 'accept' or 'decline'
      .execute('acp_dec_status');
    return { message: 'Decision updated successfully' };
  } catch (err) {
    console.error('Error in acpDecStatus:', err);
    throw err;
  }
};
