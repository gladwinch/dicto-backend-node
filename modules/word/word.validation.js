module.exports = {
    'GET_/': {},
    
    'GET_/auto-complete': {
        type: "object",
        properties: {
            word: { type: "string" },
        },
        required: ["word"]
    },

    'GET_/': {},

    'GET_/sessions': {},

    'GET_/logout': {},

    'GET_/token': {}
}