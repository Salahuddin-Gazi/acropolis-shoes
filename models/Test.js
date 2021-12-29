import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TestSchema = Schema({ products: [] });

export default model("tests", TestSchema);
