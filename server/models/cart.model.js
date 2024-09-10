import mongoose from "mongoose";

const schema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: false
    },
  
    userId: {
        type: String,
        required: true,
        unique: false
    },
    count:{
        type: Number,
        required: true,
        unique: false
    }
});

export default mongoose.model.Carts || mongoose.model("Cart", schema);