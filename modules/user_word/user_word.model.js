const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }

const UserWordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word',
        required: true
    },
    table: {
        type: String,
        enum : [
            'new',
            'learn',
            'practice',
            'known',
            'mastered'
        ],
        default: 'new'
    },
    notified: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    }
}, opts)

module.exports = mongoose.model('UserWord', UserWordSchema)