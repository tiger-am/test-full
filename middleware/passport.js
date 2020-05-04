const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const User = require('../models/User');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select('email id');

                if(user) {
                    done(null, user)
                } else {
                    done(null, false)
                }    
            } catch (e) {
                console.log(e);
            }
        })
    )
}