import express from "express";
import dotenv from "dotenv";
import { db } from "./db/db.js";
import authRoutes from "./routes/auhRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Connected to MySQL`);
  }
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

const PORT = 5000;
app.listen(process.env.PORT, () => {
  console.log(`Server started on Porrt ${process.env.PORT}`);
});
