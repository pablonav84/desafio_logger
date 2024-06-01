import mongoose from 'mongoose';

const chatColl="messages"
const messageSchema = new mongoose.Schema(
    {
  nombre:String,
  mensaje:String,
  fecha: { type: Date, default: Date.now },
},
{
  timestamps:true
});

export const chatModelo=mongoose.model(chatColl, messageSchema);