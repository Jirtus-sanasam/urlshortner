const express = require('express');
const connectToMongoDB = require('./connect');
const urlRoutes = require('./routes/url');
const app = express();
const port = 3000;

app.use(express.json());
app.use("/url", urlRoutes);

connectToMongoDB('mongodb://localhost:27017/urlshortner')
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });