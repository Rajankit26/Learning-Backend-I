
import Collection from "../models/collection.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/customError.js"

export const createCollection = asyncHandler(async(req, res) => {
    const {name} = req.body;

    if(!name){
        throw new CustomError("Plaese provide the required fields", 401)
    }

    const collection = await Collection.create({name})
     res.status(200).json({
        success : true,
        message : "Collection created successfully",
        collection
     })
})

export const updateCollection = asyncHandler(async(req , res) => {
    const {name} = req.body;
    const {id : collectionId} = req.params;

    if(!name){
        throw new CustomError("Collection name is required", 401)
    }

    const updatedCollection = await Collection.findByIdAndUpdate(collectionId, {
        name 
    },
    {
        new : true,
        runValidators : true
    }
)

    if(!updatedCollection){
        throw new CustomError("Collection not found!", 401)
    }
    res.status(200).json({
        success : true,
        message : "Collection updated successfully",
        updatedCollection
    })
})

export const deleteCollection = asyncHandler(async(req , res) => {
    const {name} = req.body;
    const {id : collectionId} = req.params;

    if(!name){
        throw CustomError("Collection name is required", 401)
    }

    const collectionToDelete = await Collection.findById(collectionId);
   

    if(!collectionToDelete){
        throw new CustomError("Collection not found", 404)
    }

    const deletedCollection = await collectionToDelete.remove();

    res.status(200).json({
        success : true,
        message : "Collection deleted successfully"
    })

})

export const getAllCollection = asyncHandler(async(req , res) => {
    
    const collection = await Collection.find({})

    if(!collection){
        throw new CustomError("Collection does no exist", 401)
    }

    res.status(200).json({
        success : true,
        collection
    })
})