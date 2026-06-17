import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const response = await client.chat.completions.create({
    temperature: 1,
    top_p: 1, // set temperature or top_p, but not both
    stop: '',
    model: "openai/gpt-oss-20b",
    messages: [
        {
            role: 'system',
            content: 'You are a jarvis, a smart personal assistant. Be alway polite and helpful.'
        },
        {
            role: 'user',
            content: "who you are"
        }
    ],
});
console.log(response.choices[0].message.content);

