import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type:String,
        default:""
    },
    last_name: {
        type:String,
        default:""
    },
    email: {
        type: String,
        unique:true,
        required:true
    },
    age:{
        type:Number,
        default:null
    },
    password: {
        type:String,
        required:true
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts",
    },
    rol: {
        type: String,
        required:true,
        enum:["usuario","admin"],
        default: 'usuario',
    },
});

export const UserModel = mongoose.model(userCollection, userSchema);