import express from 'express'
import cors from 'cors'
import ImageKit from 'imagekit';
import mongoose from 'mongoose';
import chat from './models/chat.model.js';
import userChats from './models/userChats.model.js';
import { requireAuth } from '@clerk/express'

const app= express();
const PORT= process.env.PORT;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json());

const connectDb= async()=>{
  try{
  const conn= await mongoose.connect(process.env.MONGO_URI);
  console.log(`database connected on ${conn.connection.host}`);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}
connectDb();

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, 
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

app.get('/api/test',requireAuth(),(req,res)=>{
  console.log("success");
  res.send("success");
})

app.post('/api/chats', requireAuth() , async (req, res)=>{
  const {text}= req.body;
  const userId= req.auth.userId;
  try{
    const newChat= new chat({
      userId: userId,
      history:[{role: "user",parts: [{ text }]}]
    })
    const savedChat= await newChat.save();

    const user= await userChats.findOne({userId:userId});
    console.log(user);
    if(!user){
      const newUserChats= new userChats({
        userId: userId,
        chats:[
          {
            _id: savedChat._id,
            title: text.substring(0,20),
          }
        ]
      })
      await newUserChats.save();
    }else{
      await userChats.updateOne({userId:userId},{
        $push:{
          chats:{
            _id:savedChat._id,
            title: text.substring(0,20),
          }
        }
      })
    }
    res.status(200).send(newChat._id);
  }catch(err){
    console.error(err);
    res.status(500).send(`Server Error`);
  }
});

app.get("/api/userchats", requireAuth() , async(req,res)=>{
  const {userId}= req.auth();
  try{
    const user= await userChats.find({userId});
    res.status(200).send(user[0].chats);
  }catch(err){
    console.error(err);
    res.status(500).send('error fetching User chats');
  }
} )

app.get("/api/chats/:id", requireAuth() , async(req,res)=>{
  const {userId}= req.auth();
  try{
    const chats= await chat.find({_id: req.params.id, userId});
    res.status(200).send(chats);
  }catch(err){
    console.error(err);
    res.status(500).send('error fetching chats');
  }
} )

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});



app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})