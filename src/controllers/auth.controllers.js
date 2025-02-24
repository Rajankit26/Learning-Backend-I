
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/customError.js"
import User from "../models/users.schema.js"

export const cookieOptions = {
    httpOnly : true,
    expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ,
    sameSite : "Strict"  // Prevents CSRF attacks by restricting cross-site cookie sharing
}
export const signUp = asyncHandler(async(req,res) => {

    const {name, email, password} = req.body;

    if(!name || !email || !password){
        throw new CustomError("Please provide name, email and password", 400);
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new CustomError("User already exists", 400)
    }

   const newUser = await User.create({
        name,
        email,
        password
    })

    const token = newUser.getJWTtoken()

    newUser.password = undefined //For safety purpose

    // Store this token in user's cookie
    res.cookie("token",token,cookieOptions)

    res.status(200).json({
        success : true,
        message : "SignUp successfull!",
        newUser,
        token
    })
})

export const login = asyncHandler(async(req,res) =>{

    const {email, password} = req.body;

    if(!email || !password){
        throw new CustomError("All fields are necessary", 400)
    }

    // Find user by email
    const user = await User.findOne({email}).select("+password")
    
    if(!user){
        throw new CustomError("Invalid credentials", 400)
    }

    // Compare password
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        throw new CustomError("Incorrect password", 400)
    }

    // Generate JWT Token
    const token = user.getJWTtoken()
    res.cookie("token", token, cookieOptions)
    user.password = undefined

    return res.status(200).json({
        success : true,
        message : "User logged in successfull",
        user
    })

})