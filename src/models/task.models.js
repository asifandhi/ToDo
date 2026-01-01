import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        title :{
            type:String,
            required : true,
        },
        status:{
            type:String,
            required:true,
            enum: ["todo", "in-progress", "done"]

        },
        priority:{
            type:String,
            required:true,
            enum: ["low", "medium", "high"]

        },
        taskCreator:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
)



export const Task = mongoose.model("Task",taskSchema)