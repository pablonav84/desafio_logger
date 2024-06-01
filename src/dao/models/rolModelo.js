import mongoose from "mongoose";


const rolSchema = new mongoose.Schema({
    descrip: {
        type: String,
        enum: ["usuario", "admin"] // Opciones permitidas: usuario o admin
    }
}, { timestamps: true, collection: "roles" });

export const rolModelo = mongoose.model("roles", rolSchema);
