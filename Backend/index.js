import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import connectDB from "./utilities/connectDB.js";
import Chat from "./models/chat.model.js";
import UserChats from "./models/userChats.model.js";
import admin from "firebase-admin";

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT;

const firebaseAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

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

app.post("/api/chats", firebaseAuthMiddleware, async (req, res) => {
  const { text } = req.body;
  const userId = req.user.uid;
  if (!userId) {
    return res.status(401).send("Unauthorised");
  }
  try {
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();
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

app.get("/api/userchats", firebaseAuthMiddleware, async (req, res) => {
  const userId = req.user.uid;
  try {
    const userchats = await UserChats.find({ userId });
    if (!userchats.length || !userchats[0].chats) {
      return res.status(200).send([]);
    }
    res.status(200).send(userchats[0].chats);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error while fetching userchats");
  }
});

app.get("/api/chats/:id", firebaseAuthMiddleware, async (req, res) => {
  const userId = req.user.uid;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error while fetching userchats");
  }
});

app.put('/api/chats/:id', firebaseAuthMiddleware, async(req,res)=>{
  const userId = req.user.uid;
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
