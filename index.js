const express = require("express");
const path = require("path");
const connectToMongoDB = require("./connect");
const urlRoutes = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const Url = require("./models/url");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/url", urlRoutes);75
app.use("/", staticRouter);

app.get("/test", async (req, res) => {
  const allUrls = await Url.find({});
  return res.render("home", { urls: allUrls });
});

connectToMongoDB("mongodb://localhost:27017/urlshortner")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
