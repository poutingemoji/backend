require("dotenv").config();
require("./strategies/discord");
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const RootSchema = require("./graphql");

const app = express();
const BACKEND_PORT = process.env.PORT || 3001;
const routes = require("./routes");
const { CLIENT_ROOT_URL } = require("./config");

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://agitated-stonebraker-e7d7da.netlify.app",
      "https://poutingemoji.github.io/pfp-logger-client",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 60000 * 60 * 24,
      domain: ".poutingemoji.github.io",
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: RootSchema,
  })
);

app.use("/api", routes);

app.listen(BACKEND_PORT, () => console.log(`Running on Port ${BACKEND_PORT}!`));
