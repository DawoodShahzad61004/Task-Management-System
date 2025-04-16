const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Core task operations
router.post('/login', taskController.login);
router.post('/new', taskController.newTask);
router.put('/status', taskController.updateStatus);
router.put('/priority', taskController.updatePriority);
router.get('/search/status', taskController.statusSearch);
router.get('/search/date', taskController.dateSearch);
router.get('/search/employee', taskController.employeeSearch);
router.put('/employee/status', taskController.empUpdateStatus);
router.get('/employee/search/status', taskController.empStatusSearch);
router.get('/employee/search/partial-status', taskController.empPStatusSearch);
router.put('/decision', taskController.acpDecStatus);

module.exports = router;
