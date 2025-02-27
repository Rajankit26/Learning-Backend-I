import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name :{
                type : String,
                required : ["true","Please provide a collection name"],
                trim : true,
                maxLength : [
                    120,
                    "Collection name should be more thn 120 characters"
                ]
              }
    }, 
    {
        timestamps : true
    }
);

export default mongoose.model("Collection",collectionSchema)
//saved as collections(all lowercase and in plural) in db

