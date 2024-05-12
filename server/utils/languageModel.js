const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

//instance of the GoogleGenerativeAI class
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

//function to generate text
const generateText = async (msg) => {
  //get the generative model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  //start a chat with the model
  const chat = model.startChat({
    //settings for the chat
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],

    //history of the chat for the model to learn from
    history: [
      {
        role: "user",
        parts: [{ text: "Hello, How are you?" }],
      },
      {
        role: "model",
        parts: [{ text: "I am great. Will meet you later." }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 1,
      topP: 0.1,
      topK: 16,
    },
  });

  //send the message to the chat
  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);

  //return the response
  return text;
};

module.exports = generateText;
