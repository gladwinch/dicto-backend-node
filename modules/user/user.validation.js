module.exports = {
    'POST_/': {
        type: "object",
        properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            avatar: { type: "string" },
        },
        required: ["name","email","password"]
    },
    
    'POST_/login': {
        type: "object",
        properties: {
            email: { type: "string", format: 'email' },
            password: { type: "string" }
        },
        required: ["email","password"]
    },

    'GET_/': {
        type: "object",
        properties: {
            _id: { type: "string" },
            name: { type: "string" },
        },
        required: ["_id","name"]
    }
}