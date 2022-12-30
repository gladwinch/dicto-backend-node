const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { userModel } = require('../modules/user')

module.exports = (app) => {

    // Use express-session middleware to store user sessions
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 60 * 60 * 1000
        },
        saveUninitialized: false
    }))

    // Initialize passport and restore authentication state from the session
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new LocalStrategy(
        async function(email, password, done) {
            userModel.findOne({ email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false) }
                if (!user.matchPassword(password)) { 
                    return done(null, false) 
                }

                return done(null, user)
            })
        }
    ))
      
    // Serialize and deserialize user instances to and from the session
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    })
      
    passport.deserializeUser(function(id, done) {
        userModel.findById(id, function (err, user) {
            done(err, user)
        })
    })
}