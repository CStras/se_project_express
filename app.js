const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => console.log("Connected to database."))
  .catch(console.error);
  app.use((req, res, next) => {
    req.user = {
      _id: '6768341d78ca1c82bea7c843'
    };
    next();
  });
app.use(express.json());
app.use("/", mainRouter);



app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});