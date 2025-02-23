import mongoose from "mongoose"

const couponSchema = new mongoose.Schema(
    {
        couponCode : {
            type : String,
            required : ["true","Enter a valid coupon code"]
        },
        validity : {
            type : Boolean,
            default : true
        },
        discount : {
            type : Number,
            default : 0
        },
        usersUsed : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        minOrderValue : {
            type : Number,
            default : 0
        }
    },
    {timestamps : true}
)

export default mongoose.model("Coupon",couponSchema)