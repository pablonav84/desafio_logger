import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productos"
        },
        cantidad: { type: Number, default: 1 },
    }],
}, {
    timestamps: true
});

// Registro el modelo "Cart" por no registrarlo previamente
let Cart;
try {
    Cart = mongoose.model("Cart");
} catch (e) {
    Cart = mongoose.model("Cart", cartSchema);
}

export { Cart };