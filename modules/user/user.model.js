const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        minlength: 7
    },
    fcmToken: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: [
            'user',
            'editor',
            'admin'
        ],
        default: 'user'
    }
}, opts)

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }
  
    const salt = await bcrypt.genSalt(10)
    this.password = bcrypt.hash(this.password, salt)
})
  
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = function(enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password)
}

//Reverse population with virtuals
UserSchema.virtual('subscribe', {
    ref: 'Subscribe',
    localField: '_id',
    foreignField: 'user',
    justOne: true
})

module.exports = mongoose.model('User', UserSchema)