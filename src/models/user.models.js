import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
    {
        name:{
            type :String,
            required:true,
            maxLength:10,
            unique:true,
            trim : true,
            index: true,
            lowercase:true
        },
        email:{
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
        }
    },
    {
        timestamps:true
    }
)
export const User = mongoose.model("User",userSchema);
