const mongoose = require('mongoose')

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }

const mainSchema = {
    word: {
        type: String,
        unique: true,
        required: [true, 'Please add a name']
    },
    meaning: {
        simple: String,
        medium: String,
        advance: String,
    },
    opposites: [String],
    synonyms: [String],
    sentences: [String],
    pos: {
        type: String,
        enum: [
            'noun',
            'pronoun',
            'verb',
            'adjective',
            'adverb',
            'preposition',
            'conjunction',
            'interjection'
        ],
    },
    phonetics: [{ 
        lang: String, 
        text: String, 
        audio: String
    }],
    history: {
        roots: [String],
        notes: [String]
    },
    score: {
        type: Number,
        default: 0
    }
}

mainSchema._meta = {
    meaning: {
        simple: [{ score: Number, value: String }],
        medium: [{ score: Number, value: String }],
        advance: [{ score: Number, value: String }],
    }
}

const WordSchema = new mongoose.Schema(mainSchema, opts)

module.exports = mongoose.model('Word', WordSchema)