require("dotenv").config();
require("./strategies/discord");
const express = require("express");
const app = express();
const passport = require("passport");
const PORT = process.env.PORT || 3002;
const routes = require("./routes");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors")

mongoose.connect(process.env.MONGODB_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("Connected to DB!"));
mongoose.connection.on("error", console.error);
mongoose.connection.on("disconnected", () =>
  console.log("Disconnected from DB!")
);

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}))

app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

app.listen(PORT, () => console.log(`Running on Port ${PORT}!`));
