import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CartSchema = Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
    },
  },
  products: [],
});

export default model("carts", CartSchema);
