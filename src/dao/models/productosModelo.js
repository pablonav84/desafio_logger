import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productsEsquema=mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:String,
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock:Number,
    category:String,
    password:String
},
{
    collection: "productos",
    timestamps: true
  });
  
  productsEsquema.plugin(paginate)

  export const productsModelo = mongoose.model("productos", productsEsquema);