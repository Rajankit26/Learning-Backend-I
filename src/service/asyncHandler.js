

/*
 Higher Order Function -> The function that returns a function or takes another function as an argument is known as HOF.

const asyncHandler = "Ankit"
const asyncHandler = () =>{}
const asyncHandler = (fn) =>{}
const asyncHandler = (fn) => () =>{}
const asyncHandler = (fn) => async () =>{}

*/

const asyncHandler = (fn) => async(req,res,next) =>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 400).json({
            success : false,
            message : error.message
        })
    }
}

export default asyncHandler;
