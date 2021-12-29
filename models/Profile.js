import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  addressBook: [
    {
      _id: {
        type: String,
      },
      region: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      area: {
        type: String,
      },
      address: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
  orders: [
    {
      _id: {
        type: String,
      },
      products: [{ type: Object, required: true }],
      selectedPickup: {
        type: String,
        required: true,
      },
      selectedContact: {
        type: String,
        required: true,
      },
      selectedPayment: {
        type: String,
        required: true,
      },
      totalCost: {
        type: String,
        required: true,
      },
      orderPlacedOn: {
        type: String,
        required: true,
      },
    },
  ],
  payments: [
    {
      _id: {
        type: String,
      },
      visa: {
        type: String,
        required: true,
      },
      expires: {
        type: String,
        required: true,
      },
      ccv: {
        type: String,
        required: true,
      },
      cardHolderName: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("profile", ProfileSchema);
