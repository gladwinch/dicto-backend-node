const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const RedisStore = require('connect-redis')(session)
// const redis = require('../services/redis')
const { userDAL } = require('../modules/user')

const localAuthUser = async (email, password, done) => {
    try {
        const user = await userDAL.getUserByEmail(email)
        if(!user) {
            console.log('user not found! localAuthUser')
            return done(null, false)
        }
        if (!user.matchPassword(password)) { 
            console.log('password do not matcg')
            return done(null, false) 
        }

        return done(null, user)
    } catch (err) {
        console.log('localAuthUser catch error')
        done(err)
    }
}

module.exports = app => {
    // Use express-session middleware to store user sessions
    app.use(session({
        // store: new RedisStore({ client: redis }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        cookie: {
            httpOnly: false,
            secure: false,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000
        },
        saveUninitialized: false
    }))

    // Initialize passport and restore authentication state from the session
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        localAuthUser
    ))
      
    // Serialize and deserialize user instances to and from the session
    passport.serializeUser(function(user, done) {
        if(!user)  {
            console.log('ERR: serializeUser')
            return done('user not found')
        }
        done(null, user._id)
    })
      
    passport.deserializeUser(function(id, done) {
        userDAL.getById(id)
        .then(user => done(null, user))
        .catch(err => {
            console.log('ERR: deserializeUser catch')
            console.error(err)
        })
    })
}