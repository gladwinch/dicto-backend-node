const mongoose = require('mongoose')

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }

const WordSchema = new mongoose.Schema({
    word: {
        type: String,
        unique: true,
        required: [true, 'Please add a name']
    },
    opposites: {
        type: [String],
        default: []
    },
    synonyms: {
        type: [String],
        default: []
    },
    sentences: {
        type: [String],
        default: []
    },
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
    phonetics: {
        type: [
            { 
                lang: String, 
                text: String, 
                audio: String
            }
        ],
        default: []
    },
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