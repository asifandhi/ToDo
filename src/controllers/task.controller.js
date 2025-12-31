import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";

const createTask = AsyncHandler(async (req,res) => {
    const {name,title,priority} = req.body;
     if([name,title,priority].some((feild) => feild?.trim() === "")){
        throw new ApiError(400,"Name, title, and priority are required")
    }
    const user = await User.findOne({name:name.toLowerCase()})
    if(!user){throw new ApiError(400,"User does not exist...")};

    const task = await Task.create({
        title:title,
        status : "todo",
        priority:priority,
        taskCreator:user?._id
    })

    if(!task){throw new ApiError(400,"Task not created ")}

    return res
    .status(200)
    .json(
        new ApiResponse(200,task,"task created sucessully...")
    )

})

const deleteTask = AsyncHandler(async (req,res) => {
    const {name} = req.body;
    const {taskId} = req.params
    
    

    if(!name || !taskId){
        new ApiError(200,"Name and Task id is required...")
    }
    const user = await User.findOne({name:name.toLowerCase()})
    if(!user){throw new ApiError(400,"User does not exist...")};

    const delete_task = await Task.findByIdAndDelete(taskId);
    if(!delete_task){
        throw new ApiError(400,"can not delete Task...")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"task deleted  sucessully...")
    )
    
    
})

const getTaskById = AsyncHandler(async (req,res) => {
    const {name} = req.body;
    const {taskId} = req.params
    
    if(!name || !taskId){
        new ApiError(200,"Name and Task id is required...")
    }
    const user = await User.findOne({name:name.toLowerCase()})
    if(!user){throw new ApiError(400,"User does not exist...")};
    
    const task = await Task.findById(taskId);
    if(!task){
        throw ApiError(400,"Task doent fetched")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,task,"task fetched   sucessully...")
    )
})
export {createTask,deleteTask,getTaskById}