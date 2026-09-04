import mongoose,{models,model,Schema} from "mongoose";

export interface IUser{
    username:String,
    email:String,
    password:String
}

const Userschema  = new Schema<IUser>({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const User = mongoose.models?.users || mongoose.model<IUser>("users",Userschema)
export default User