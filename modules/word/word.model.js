const mongoose = require('mongoose')

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }

const WordSchema = new mongoose.Schema({
    word: {
        type: String,
        unique: true,
        required: [true, 'Please add a name']
    },
    synopsis: String,
    opposites: {
        type: [String],
        default: []
    },
    synonyms: {
        type: [String],
        default: []
    },
    sentences: {
        type: [
            {
                example: String,
                explanation: String,
                stage: {
                    type: String,
                    enum: [
                        'easy',
                        'medium',
                        'difficult',
                        'deficient'
                    ],
                    default: 'medium'
                },
                quality: {
                    type: Number,
                    default: 0
                }
            }
        ],
        default: []
    },
    definitions: [
        {
            definition: String,
            examples: [String],
            partOfSpeech: String,
            context: {
                type: String,
                default: "general"
            },
            quality: {
                type: Number,
                default: 0
            }
        }
    ],
    morpheme: [
        {
            morpheme: String,
            type: {
                type: String,
                // enum: [
                //     'root',
                //     'prefix',
                //     'suffix',
                //     'inflectional-suffix',
                //     'derivational-suffix',
                //     'infix',
                //     'circumfix'
                // ]
            },
            meaning: String
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