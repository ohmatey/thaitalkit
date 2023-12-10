const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')

const defaultModel = 'gpt-3.5-turbo-1106'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const runCompletion = async ({
  prompt,
  model = defaultModel,
}) => {
  const chatCompletion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user', 
        content: prompt
      }
    ],
    response_format: {
      type: 'json_object'
    },
  })

  // Extract the translated Thai text from the API response
  const thaiText = chatCompletion.choices[0].message.content

  return thaiText
}

const translateText = async ({
  text,
  model = defaultModel,
}) => {
  const prompt = `
    Translate the following English text to Thai:\\n\\n${text}\\n\\nThai.
    Return valid JSON in the following format:
    {
      "english": "${text}",
      "thai": ""
    }
  `

  const thaiText = await runCompletion({
    prompt,
    model,
  })

  return thaiText
}

const explainTranslation = async ({
  originalText,
  translatedText,
  model = defaultModel,
}) => {
  const prompt = `
    Original English text:
    ${originalText}
    Translated Thai text:
    ${translatedText}
    
    You are a Harvard Thai tutor teaching a student how to learn Thai.
    Explain the translation with notable takeaways for someone learning Thai language by including one for one word translations and notable takeaways.
    You are to explain the Thai translation in English.

    Return valid JSON in the following format:
    {
      "explanation": "",
      // interesting and useful keywords from the translated text to help the student learn Thai
      "keywords": ["", ""]
    }
  `

  const thaiText = await runCompletion({
    prompt,
    model,
  })

  return thaiText
}

const audioLocation = path.join(__dirname, './audio/')

const generateAudio = async ({
  name = '',
  input,
  model = 'tts-1',
  voice = 'alloy',
}) => {
  try {
    const mp3 = await openai.audio.speech.create({
      model,
      voice,
      input,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    const audioFile = `${audioLocation}${name}.mp3`

    await fs.promises.writeFile(audioFile, buffer)

    return buffer
  } catch (error) {
    console.error(error)
  }
}

exports.runCompletion = runCompletion
exports.translateText = translateText
exports.explainTranslation = explainTranslation
exports.generateAudio = generateAudio