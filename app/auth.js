const passport = require('koa-passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'terces-twj',
    },
    async function(jwtPayload, callback) {
      try {
        // return callback(null, user);
        return callback(null, false);
      } catch (err) {
        return callback(err);
      }
    },
  ),
);
