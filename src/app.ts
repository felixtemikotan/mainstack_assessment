import express, {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import user from "./routes/user";
import products from "./routes/products";
import { connectToCluster } from "./config/database.config";
import {DB_URI} from "./config/config";
const Port = process.env.PORT || 3000;
const app = express()

app.use(cors());
connectToCluster(DB_URI).then((client) => {
  console.log('Connected to MongoDB Atlas cluster!');
}).catch((error:any) => {
  console.error('Failed to connect to MongoDB Atlas cluster!', error);
  process.exit();
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/user', user);
app.use('/product',products)

app.use(function (req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});


export default app;