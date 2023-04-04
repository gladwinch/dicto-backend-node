module.exports = {
    'GET_/': {},
    
    'GET_/auto-complete': {
        type: "object",
        properties: {
            word: { type: "string" },
        },
        required: ["word"]
    },

    'POST_/notification': {}
}