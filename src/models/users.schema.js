import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import bcrypt, { compare } from "bcryptjs";
import JWT from "jsonwebtoken"
import config from "../config/index.js";


const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true,"Name is required"],
            maxLength : [50,"Name must be less than 50 chars"]
        }, 
        email : {
            type : String,
            required : [true,"Email is required"]
        },
        password : {
            type : String,
            required : [true,"Password is required"],
            minLength : [9, "Password must be at least 9 chars"],
            select : false
        },
        role : {
            type : String,
            enum : Object.values(AuthRoles),
            default : AuthRoles.USER
        },
        forgotPasswordToken : String,
        forgotPasswordExpiry : Date
    },
    {timestamps : true}
)

// Encrypt the password before saving : HOOKS

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
       this.password = await bcrypt.hash(this.password, 10)
       next()
})

userSchema.methods = {
    // compare password
    comparePassword : async function(enteredPassword){
       return await bcrypt.compare(enteredPassword,this.password)
    },
    // generate JWT token
    getJWTtoken : function(){
        JWT.sign({_id : this._id, role : this.role},config.JWT_SECRET, {
            expiresIn : config.JWT_EXPIRY
        })
    }
}


export default mongoose.model("User",userSchema)