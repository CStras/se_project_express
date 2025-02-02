require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middleware/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to database."))
  .catch(console.error);
app.use(express.json());
app.use(cors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
