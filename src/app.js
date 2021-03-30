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
const CLIENT_PORT = process.env.CLIENT_PORT;
const BACKEND_PORT = process.env.PORT || process.env.BACKEND_PORT;
const routes = require("./routes");

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
      CLIENT_PORT
        ? `http://localhost:3000`
        : "https://poutingemoji.github.io",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
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

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: RootSchema,
  })
);

app.use("/api", routes);

app.listen(BACKEND_PORT, () => console.log(`Running on Port ${BACKEND_PORT}!`));
