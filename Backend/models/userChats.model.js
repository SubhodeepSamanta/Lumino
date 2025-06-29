import mongoose, { Schema } from "mongoose";

const UserChatsSchema= new Schema({
    userId:{
        type: String,
        required: true
    },
    chats:[
        {
            _id:{
                type:String,
                required:true
            },
            title:{
                    type: String,
                    required: true
            },
            createdAt:{
                type: Date,
                deafult: Date.now()
            }
        }
    ]
}, {timestamps:true} );

const UserChats= mongoose.model("UserChats", UserChatsSchema);
export default UserChats;