import  { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { createUserValidator,loginValidator,options } from "../utils/utils";
import {connectToCluster} from "../config/database.config";
import bcrypt from 'bcryptjs';
import {DB_URI,JWT_SECRET} from "../config/config";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Joi from "joi";
import { MongoClient } from "mongodb";


export async function createUser(req:Request,res:Response){
    try{
        console.log('Creating user...');
        const id = uuidv4();
        const {error} = createUserValidator.validate(req.body,options);
        if(error){
            return res.status(400).json({status:400,message:error.details[0].message})
        }
        const {fullName,username,password} = req.body;
        const passwordHash = await bcrypt.hash(req.body.password, 8);
        const mongoClient = new MongoClient(DB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('xilefplayground');
        const collection = db.collection('usersCollection');
        const result = await collection.insertOne({
            id,
           fullName:fullName,
           userName:username,
           password:passwordHash,
        });
        if(result?.insertedId){
        return res.status(201).json({status:201,message:'User created successfully!',user:{
            id:id,
            fullName:fullName
        }})
        }else{
            return res.status(400).json({status:400,message:'Failed to create user!',reason:result})
        }
    }catch(err:any){
        
        return res.status(500).json({status:500,message:err.message})
    }
}
export async function login(req:Request,res:Response){
    try{
        const {error} = loginValidator.validate(req.body,options);
        if(error){
            return res.status(400).json({
                status:400,
                message:error.details[0].message
            })
        }
        const {username,password} = req.body;
        const mongoClient = new MongoClient(DB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('xilefplayground');
        const collection = db.collection('usersCollection');
        const user = await collection.findOne({userName:username});
        if(!user){
            return res.status(404).json({
                status:404,
                message:'User not found!'
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                status:400,
                message:'Invalid credentials!'
            })
        }
        const token = jwt.sign({id:user.id},JWT_SECRET as string,{expiresIn:'1h'});
        return res.status(200).json({
            status:200,
            message:'Login successful!',
            token
        })


    }catch(error:any){
        return res.status(500).json({
            status:500,
            message:error.message
        })
    }
}