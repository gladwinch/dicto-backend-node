require('dotenv').config()

const { Configuration, OpenAIApi } = require('openai')

const openaiApiKey = process.env.OPENAI_KEY
const configuration = new Configuration({
  apiKey: openaiApiKey,
})

module.exports = openai = new OpenAIApi(configuration)