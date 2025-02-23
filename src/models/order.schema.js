import mongoose from "mongoose"

const orderSchema = new mongoose.model(
    {
        product : {
            type : [
                {
                    productId : {
                        type : mongoose.Schema.Types.ObjectId,
                        ref : "Product"
                    },
                    count : Number,
                    price : Number
                }
            ],
            required : true
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        address : {
            type : String,
            required : true
        },
        phoneNo : {
            type : Number,
            required : true
        },
        amount : {
            type : Number,
            required : true
        },
        coupan : String,
        transactionId: String,
        status : {
            type : String,
            enum : ["ORDERED","SHIPPED","DELIVERED","CANCELLED"],
            default : true
        }
    },
    {timestamps : true}
);

export default mongoose.model("Order",orderSchema);