require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai")

console.log('x', process.env.OPENAI_KEY)

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration);

async function main() {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "definition of nuance",
    })
    
    console.log(completion.data)
}

main()