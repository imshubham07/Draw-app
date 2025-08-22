import express from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUserSchema} from "@repo/common/types"

const app = express()



app.post("/signup", async (req, res) => {

    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success){
      return res.json({
        message:"Incorrect Inputs"
      })
    }
  // db call
  res.json({
    message:"123"
  })
});


app.post("/signin", async (req, res) => {
  
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)
    res.json(token)
});


app.post("/room",middleware, async (req, res) => {
  // db call
  res.json({
    roomId:123
  })
});


app.listen(3000)