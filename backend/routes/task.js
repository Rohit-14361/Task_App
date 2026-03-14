const express=require('express');
const router=express.Router();

const {isAuth}=require('../middleware/Auth');
const {getAllTasks,createTask,updateTask,deleteTask, getTaskById}=require('../controllers/Task');

router.get('/get-all-tasks',isAuth,getAllTasks);
router.post('/create-task',isAuth,createTask);
router.put('/update-task/:taskId',isAuth,updateTask);
router.delete('/delete-task/:taskId',isAuth,deleteTask);
router.get('/get-task-by-id/:taskId',isAuth,getTaskById)

module.exports=router;