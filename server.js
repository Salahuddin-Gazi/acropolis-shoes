import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import users from "./routes/api/users.js";
import auth from "./routes/api/auth.js";
import profile from "./routes/api/profile.js";
import product from "./routes/api/product.js";
import cart from "./routes/api/cart.js";
import * as path from "path";
// import test from "./routes/api/test.js";

// init express
const app = express();
app.use(cors());

// connecting the DB
connectDB();

// init middleware
app.use(express.json({ limit: "40000kb", extended: true }));

// define routes
// (❁´◡`❁) ☆*: .｡. o(≧▽≦)o .｡.:*☆
// app.get("/", (req, res) => {
//   res.send("API Running");
// });

//  @Users
app.use("/api/users", users);

// @Auth
app.use("/api/auth", auth);

// @Profile
app.use("/api/profile", profile);

// @Product
app.use("/api/product", product);

// @Cart
app.use("/api/cart", cart);

// // @test
// app.use("/api/test", test);

// Serve static assets in productuion
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT;
// Connecting port
app.listen(PORT, () => {
  console.log(`Server started on Port: ${PORT}`);
});
