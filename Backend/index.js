import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import connectDB from "./utilities/connectDB.js";
import Chat from "./models/chat.model.js";
import UserChats from "./models/userChats.model.js";
import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

connectDB();

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
connectDB();

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.use(clerkMiddleware());

const legacyRequireAuth = async (req, res, next) => {
  try {
    const {userId} = req.auth();
    if(userId){
      next();
    }else{
      return res.status(401).send("Unauthorised");
    }
  } catch (err) {
    console.log(err);
  }
};

app.post("/api/chats", legacyRequireAuth, async (req, res) => {
  const { text } = req.body;
  const {userId} = req.auth();
  
  if (!userId) {
    return res.status(401).send("Unauthorised");
  }
  try {
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    //userchat exists
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      const newUserChats = new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 20),
          },
        ],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: [
              {
                _id: savedChat._id,
                title: text.substring(0, 20),
              },
            ],
          },
        }
      );
    }
    res.status(200).send(newChat._id);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error while fetching chats");
  }
});

app.get("/api/userchats",legacyRequireAuth,async(req,res)=>{
  const {userId} = req.auth();
  try{
    const userchats= await UserChats.find({userId});
    if (!userchats.length || !userchats[0].chats) {
      return res.status(200).send([]);
    }
    res.status(200).send(userchats[0].chats);
  }catch(err){
    console.log(err);
    return res.status(500).send("Error while fetching userchats");
  }
})

app.get("/api/chats/:id",legacyRequireAuth,async(req,res)=>{
  const {userId} = req.auth();
  try{
    const chat= await Chat.findOne({_id: req.params.id ,userId});
    res.status(200).send(chat);
  }catch(err){
    console.log(err);
    return res.status(500).send("Error while fetching userchats");
  }
})

app.put('/api/chats/:id',legacyRequireAuth, async(req,res)=>{
  const {userId} = req.auth();
  const {question,answer,img}= req.body;
  const newItems= [
    ...(question?[{role:"user", parts:[{text:question}],...(img && {img})}]:[]),
    {role:"model", parts:[{text:answer}]}
  ]
  try{
    const updatedChat= await Chat.updateOne({_id:req.params.id,userId},
      {
        $push:{
          history:{
            $each: newItems
          }
        }
      }
    );

    res.status(200).send(updatedChat);
  }catch(err){
    console.log(err);
    return res.status(500).send("Error adding chat");
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
