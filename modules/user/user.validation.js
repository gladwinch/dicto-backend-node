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

    'POST_/notification': {
        type: "object",
        properties: {
            fcmToken: { type: "string" },
            email: { type: "string" }
        },
        required: ["email","fcmToken"]
    },
    
    'POST_/login': {
        type: "object",
        properties: {
            email: { type: "string", format: 'email' },
            password: { type: "string" }
        },
        required: ["email","password"]
    },

    'GET_/': {},

    'GET_/sessions': {},

    'GET_/logout': {},

    'GET_/token': {}
}