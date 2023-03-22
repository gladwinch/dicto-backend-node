module.exports = {
    'GET_/': {},

    'POST_/': {
        type: "object",
        properties: {
            word: { type: "string" }
        },
        required: ["word"]
    },

    'PUT_/': {
        type: "object",
        properties: {
            _id: { type: "string" },
            payload: { type: "object" }
        },
        required: ["payload","_id"]
    },
}