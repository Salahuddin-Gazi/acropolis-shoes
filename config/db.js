import mongoose from "mongoose";
import config from "config";
const uri = config.get("mongoURI");

export const connectDB = async () => {
  try {
    //   connecting to mongoDB
    await mongoose.connect(uri);
    console.log("Mongo DB Connected .....");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
