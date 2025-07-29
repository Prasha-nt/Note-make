import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) return done(null, existingUser);

        const newUser = new User({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          googleId: profile.id,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);
