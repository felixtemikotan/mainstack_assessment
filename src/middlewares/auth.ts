import { Request, Response, NextFunction } from "express";
import {DB_URI,JWT_SECRET} from "../config/config";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Joi from "joi";
import { MongoClient } from "mongodb";




export async function auth(req: Request | any, res: Response, next: NextFunction) {
  try {
    console.log("Inside the auth function", req.body, req.body.token,req.headers.token);
    const authorization = req.body.token || req.headers.token;
    console.log("authorization",authorization)
    if (!authorization) {
      console.log("Authentication required. Please login");
      return res.status(401).json({ msg: "Authentication required. Please login" })
    }

    const token = req.body.token || req.headers.token;
    let verified = jwt.verify(token, JWT_SECRET);
    console.log("Verified token", verified);

    if (!verified) {
      console.log("Token expired/invalid. Please login");
      return res.status(401).json({ msg: "Token expired/invalid. Please login" });
    }

    const { id } = verified as { [key: string]: string };
    console.log("id", id);
    const mongoClient = new MongoClient(DB_URI);
    await mongoClient.connect();
    const db = mongoClient.db('xilefplayground');
    const collection = db.collection('usersCollection');
    const user:any = await collection.findOne({id:id});
    if (!user) {
      console.log("User could not be identified");
      return res.status(401).json({ msg: "User could not be identified" });
    }

    req.user = user ;
    console.log("User identified", req.user);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Unexpected Auth error" });
  }
};