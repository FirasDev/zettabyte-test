const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user')


function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await User.findByCredentials(email, password)
            if (user) {
                console.log('Found')
                return done(null, user, { message: 'User Found !' })
            }
        } catch (e) {
            return done(null, false)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
        //console.log('user.id' + user)
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}

module.exports = initialize