const mongoose = require('mongoose')

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }

const WordSchema = new mongoose.Schema({
    word: {
        type: String,
        unique: true,
        required: [true, 'Please add a name']
    },
    opposites: [String],
    synonyms: [String],
    sentences: [String],
    definitions: [
        {
            simpleDefinition: String,
            definition: String,
            examples: [String],
            partOfSpeech: String,
            context: {
                type: String,
                default: "general"
            },
            priority: {
                type: Number,
                default: 0
            }
        }
    ],
    phonetics: [
        { 
            lang: String, 
            text: String, 
            audio: String
        }
    ],
    etymology: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    tags: [String],
    _meta: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    }
}, opts)

module.exports = mongoose.model('Word', WordSchema)