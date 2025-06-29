import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import connectDB from "./utilities/connectDB.js";
import Chat from "./models/chat.model.js";
import UserChats from "./models/userChats.model.js";

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

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", async (req, res) => {
  const { userId, text } = req.body;
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
      UserChats.updateOne(
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
    res.status(500).send("Error while fetching chats");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
