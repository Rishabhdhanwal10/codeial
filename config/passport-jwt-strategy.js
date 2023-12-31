const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('../models/user');

console.log(env.google_client_id);

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret_key
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done){

    User.findById(jwtPayload._id, function(err, user){
        if(err){console.log('Error in finding user from JWT', err); return;}

        if(user){
            return done(null, user);
        }else{
            done(null, false);
        }

    })

}));

module.exports = passport;