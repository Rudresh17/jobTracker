const GoogleStrategy = require("passport-google-oauth20").Strategy
const mongoose= require("mongoose")
const User= require("../models/User")
const { token } = require("morgan")


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(accessToken, 'accesstoken');

        try {
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImg: profile.photos[0].value,
            token: accessToken,
          };

          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // Update token in case it has changed
            user.token = accessToken;
            await user.save();
            return done(null, user);
          } else {
            user = await User.create(newUser);
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user); // Pass the user object to the next middleware
    } catch (err) {
      console.error(err);
      done(err, null); // Pass the error to Passport
    }
  });
};