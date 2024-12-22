const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const PORT = 8001;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//connection
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

//route

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);

// app.get("/test", async (req, res) => {
//   const allUrls = await URL.find({});
//   return res.render("home", {
//     urls: allUrls,
//   });
// });

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if (entry) {
    res.redirect(entry.redirectUrl);
  } else {
    res.status(404).send("url not found");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
