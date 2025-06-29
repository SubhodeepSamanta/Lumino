import express from 'express'
import cors from 'cors'
import ImageKit from 'imagekit';
import connectDB from './utilities/connectDB.js';

const app= express();
const PORT= process.env.PORT;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json());

connectDB();

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, 
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

app.get('/api/upload', function (req, res) {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post('/api/chats', function (req, res) {
  const {text}= req.body;
  console.log(text);
});


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})