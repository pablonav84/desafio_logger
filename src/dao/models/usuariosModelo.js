import mongoose from "mongoose";

export const usuarioModelo=mongoose.model(
    "usuarios",
    new mongoose.Schema(
        {
            nombre: String,
            apellido: String,
            email: {
                type: String, unique:true
            },
            edad: Number,
            password: String, 
            cart: { 
                type: mongoose.Types.ObjectId,
                ref: 'Cart'
            },
            rol: {
                type: mongoose.Types.ObjectId,
                ref: "roles"
            }
        },
        {timestamps:true}
    )
)