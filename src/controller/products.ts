import  { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { addProductValidator,options, updateProductValidator } from "../utils/utils";
import { connectToCluster } from "../config/database.config";
import {DB_URI,JWT_SECRET} from "../config/config";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Joi from "joi";
import { MongoClient } from "mongodb";


export async function addProduct(req:Request,res:Response){
    try{
        console.log('Adding products...');
        const {error} = addProductValidator.validate(req.body,options);
        if(error){
            return res.status(400).json({status:400,message:error.details[0].message})
        }
        const {name,price,description,category,totalItems} = req.body;
        const mongoClient = new MongoClient(DB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('xilefplayground');
        const collection = db.collection('productsCollection');
        const result:any = await collection.insertOne({
            id:uuidv4(),
            name,
            price,
            description,
            category,
            totalItems,
            remainingItems:0,
            itemsSold:0,
        });
        if(result?.insertedId){
        return res.status(200).json({status:200,message:'Product added successfully!',product:{
            id:result.insertedId,
            name,
            price,
            description,
            category,
            totalItems,
        
        }})
        }else{
            return res.status(400).json({status:400,message:'Failed to add products!'})
        }
    }catch(error:any){
        return res.status(500).json({status:500,message:error.message})
    }
}

export async function updateProduct(req:Request,res:Response){
    try{
        console.log('Updating products...');
        const {error} = updateProductValidator.validate(req.body,options);
        if(error){
            return res.status(400).json({status:400,message:error.details[0].message})
        }
        const {name,price,description,category,totalItems} = req.body;
        const mongoClient = new MongoClient(DB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('xilefplayground');
        const collection = db.collection('productsCollection');
        const result = await collection.updateOne({
            id:req.params.id
        },{
            $set:{
                name,
                price,
                description,
                category,
                totalItems,
            }
        });
        if(result?.modifiedCount){
        return res.status(200).json({status:200,message:'Product updated successfully!'})
        }else{
            return res.status(400).json({status:400,message:'Failed to update products!'})
        }

    }catch(error:any){
        return res.status(500).json({status:500,message:error.message})
    }
}

export async function getSingleProduct(req:Request,res:Response){
    try{
        console.log('Fetching single product...');
        const mongoClient = new MongoClient(DB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('xilefplayground');
        const collection = db.collection('productsCollection');
        const product = await collection.findOne({id:req.params.id});
        if(product){
        return res.status(200).json({status:200,message:'Product fetched successfully',product})
        }else{
            return res.status(404).json({status:404,message:'Product not found!'})
        }

    }catch(error:any){
        return res.status(500).json({status:500,message:error.message})
    }
}

export async function getAllProducts(req:Request,res:Response){
    try{
        console.log("Fetching all products...");
        const mongoClient = new MongoClient(DB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('xilefplayground');
        const collection = db.collection('productsCollection');
        const products = await collection.find().toArray();
        if(products){
        return res.status(200).json({status:200,message:'Products fetched successfully',products})
        }else{
            return res.status(404).json({status:404,message:'No products found!'})
        }

    }catch(error:any){
        return res.status(500).json({status:500,message:error.message})
    }
}

export async function sellProduct(req:Request,res:Response){
    try{
        console.log('Selling products...');
        const {quantity} = req.body;
        const mongoClient = new MongoClient(DB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('xilefplayground');
        const collection = db.collection('productsCollection');
        const product = await collection.findOne({id:req.params.id});
        if(product){
            if(product.totalItems < quantity){
                return res.status(400).json({status:400,message:'Insufficient items!'})
            }
            const result = await collection.updateOne({
                id:req.params.id
            },{
                $set:{
                    remainingItems:product.totalItems-quantity,
                    itemsSold:product.itemsSold+quantity,
                    price:product.price*quantity
                }
            });
            if(result?.modifiedCount){
                return res.status(200).json({status:200,message:'Product sold successfully!',price:product.price*quantity,quantity:quantity,remainingItems:product.totalItems-quantity,itemsSold:product.itemsSold+quantity})
            }else{
                return res.status(400).json({status:400,message:'Failed to sell products!'})
            }
        }else{
            return res.status(404).json({status:404,message:'Product not found!'})
        }

    }catch(error:any){
        return res.status(500).json({status:500,message:error.message})
    }
}