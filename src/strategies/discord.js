const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const User = require("../database/models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ id });
    return user ? done(null, user) : done(null, null);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DASHBOARD_CLIENT_ID,
      clientSecret: process.env.DASHBOARD_CLIENT_SECRET,
      callbackURL: process.env.DASHBOARD_CALLBACK_URL,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, username, discriminator, avatar, guilds } = profile;
      console.log(id, username, discriminator, avatar, guilds);
      try {
        const findUser = await User.findOneAndUpdate(
          { id: id },
          { discordTag: `${username}#${discriminator}`, avatar, guilds }
        );
        if (findUser) {
          console.log("User was found");
          return done(null, findUser);
        } else {
          const newUser = await User.create({
            id,
            username,
            discordTag: `${username}#${discriminator}`,
            avatar,
            guilds,
          });
        }
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
