import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Task } from "../models/task.models.js";

const createUser = AsyncHandler(async (req,res)=> {
    const {name,email} = req.body;

    if([name,email].some((feild) => feild?.trim() === "")){
        throw new ApiError(400,"Name or Email os required ")
    }

    const userExist = await User.findOne({
        $or:[{name},{email}]
    });
    if(userExist){
        throw new ApiError(409,"name and user is already exist try with different")
    }

    const user = await User.create({
        name :name,
        email
    })

    if(!user){
        throw new ApiError(500,"user not created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"user created successfully")
    )
})

const deleteUser = AsyncHandler(async (req,res)=> {
    const {name,email} = req.body;

    if([name,email].some((feild) => feild?.trim() === "")){
        throw new ApiError(400,"Name or Email os required ")
    }
    

    
    const user = await User.findOne({name:name.toLowerCase()})
    if(!user){
        throw new ApiError(405,"user Doesnt not exist ")
    }
    
    const DeleteTasks = await Task.deleteMany({taskCreator:user?._id})
    if(!DeleteTasks){
        throw new ApiError(400,"cant delete tasks")
    }
    const DeleteUser = await User.findOneAndDelete({name:name})
    if(!DeleteUser){
        throw new ApiError(400,"cant delete user")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"user deleted successfully")
    )

})
export {createUser,deleteUser}