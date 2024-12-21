const express = require('express');

const app = express();
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});