module.exports = {
    'GET_/': {},

    'POST_/': {
        type: "object",
        properties: {
            _id: { type: "string" }
        },
        required: ["_id"]
    },
}