import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : ["true","Product name is required"],
            trim : true,
            maxLength : [100,"Product name should not be greater than 100 chars"]
        },

        price : {
            type : Number,
            required : ["true","please provide the product price"],
            maxLength : [5,"product price should be less than 5 chars"] 
        },
        description : {
            type : String
        },
        stocks : {
            type : Number,
            default : 0
        },
        photos : [
            {
                secure_url : {
                    type :String,
                    required : true
                }
            }
        ],
        sold : {
            type : Number,
            default : 0
        },
        collectionId : {
            ref : "Collection"
        }
    },
    {timestampsmps : true}
)

export default mongoose.model("Prduct",productSchema)