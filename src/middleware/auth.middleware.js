import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/customError.js"
import config from "../config/index.js"
import User from "../models/users.schema.js"

export const isLoggedIn = asyncHandler(async(req,res,next) => {
    
    let token ;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new CustomError("Not authorised to access the resource", 401);
    }

    try {
         // Verify JWT Token
        const jwtPayLoad = JWT.verify(token,config.JWT_SECRET);

        // Fetch user details
        req.user = await User.findById(jwtPayLoad._id,"name email role")

        if(!req.user){
            throw new CustomError("User no longer exist",401)
        }
        next()
    } catch (error) {
        throw new CustomError("Invalid or expired token", 401)
    }
})

export const authorize = (...requiredRoles) => asyncHandler(async (req, res, next) => {
    if(!requiredRoles.includes(req.user.role)){
        throw new CustomError("You are not authorized to access this resource")
    }
    next()
})


