import mongoose, { Schema } from "mongoose";

const ChatSchema= new Schema({
    userId:{
        type: String,
        required: true
    },
    history:[
        {
            role:{
                type:String,
                enum: ["user","model"],
                required:true
            },
            parts:[{
                text:{
                    type: String,
                    required: true
                }
        }],
            img:{
                type: String,
                required: false
            }
        }
    ]
}, {timestamps:true} );

const Chat= mongoose.model("Chat", ChatSchema);

export default Chat;