import Product from "../models/product.schema.js"
import formidable from "formidable"
import CustomError from "../utils/customError.js"
import asyncHandler from "../service/asyncHandler.js"
import { s3FileUpload, s3FileDelete } from "../service/imageUpload.js"
import config from "../config/index.js"
import mongoose from "mongoose"
import fs from "fs"

export const addProduct = asyncHandler(async (req , res) => {
    
    const form = formidable({multiples : true, keepExtensions : true})

    form.parse(req, async (err, fields, files) => {
        if(err){
            throw new CustomError(err.message || "Something went wrong", 500)
        }

        const productId = new mongoose.Types.ObjectId()
        console.log(fields, files);

        if(!fields.name ||
            !fields.price ||
            !fields.description ||
            !fields.stocks ||
            !fields.collectionId
        ){
            throw new CustomError("Please fill all the fields", 500)
        }

        let imageArrayResp = Promise.all(
            Object.keys(files).map(async (file, index) => {
                const element = files[file]
                console.log(element);

                const data = fs.readFileSync(element.filepath);

                const upload = await s3FileUpload({
                    bucketName : config.S3_BUCKET_NAME,
                    key : `products/${productId}/photo_${index + 1}.png`,
                    body : data,
                    contentType : element.mimetype
                })
                console.log(upload);
                return {
                    secure_url :  upload.Location
                }
            })
        )

        let imageArray = await imageArrayResp;

        const product = await Product.create({
            _id : productId,
            photos : imageArray,
            ...fields
        })

        if(!product){
            throw new CustomError("Product creation unsuccessfull", 400)
        }

        res.status(200).json({
            success : true,
            product
        })
    })
})

export const getAllProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    if(!products){
        throw new CustomError("Product not found", 400);
    }

    res.status(200).json({
        success : true,
        products
    })
})

export const getProductById = asyncHandler(async(req, res) => {
    const {id : productId} = req.params;

    const product = await Product.findById(productId);

    if(!product){
        throw new CustomError("Product not found");
    }

    res.status(200).json({
        success : true,
        product
    })

})

export const getProductByCollectionId = asyncHandler(async(req,res) => {
    const {id : collectionId} = req.params;

    const product = await Product.find({collectionId});

    if(!product){
        throw new CustomError("Product not found", 400);
    }

    res.status(200).json({
        success : true,    })
        product
})

export const deleteProduct = asyncHandler(async (req, res) =>{
    const {id : productId} = req.params;

    const products = await Product.findById(productId);

    if(!products){
        throw new CustomError("Product not found", 400);
    }

    const deletePhoto = Promise.all(
        products.photos.map(async(elem,index) =>{
            await s3FileDelete({
                bucketName : config.S3_BUCKET_NAME,
                key : `products/${products._id.toString()}/photo_${index + 1}.png`
            })
        })
    )

    await deletePhoto;
    await products.remove();
    res.status(200).json({
        success : true,
        message : "Product has been deleted successfully"
    })
})