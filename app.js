import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// zod, schema validation library, can be used to validate 

const response = await client.chat.completions.create({
    temperature: 1,
    top_p: 1, // set temperature or top_p, but not both
    stop: '', // stop sequence for the model to stop generating further tokens
    max_completion_tokens:  1000, // to limit the number of tokens in output 
    frequency_penalty: 1, // to penalize new tokens based on their existing frequency in the text so far
    presence_penalty: 1,
    model: "openai/gpt-oss-20b",
    // response_format: { 'type': 'json_object'},

    response_format: {
        type: 'json_schema',
        json_schema: {
            name: 'sentiment_schema',
            schema: {
                type: 'object',
                properties: {
                    sentiment: {
                        type: 'string',
                        enum: ['Positive', 'Neutral', 'Negative'],
                    }
                },
                required: ['sentiment']
            }
        }
    },

    
    messages: [
        {
            role: 'system',
            content: `You are a jarvis, a smart review grader. Your task is to analyse given review and return the sentiment. 
            Classify the review as positve, Netural or negative. You must return the result in Valid JSON Sturcture.
            example: {"sentiment" : "Negative"} 
            `
        },
        {
            role: 'user',
            content: `Review: These headphones arrived quickly and look great, but the left earcup stop working after a week.
            Sentiment:
            ` 
        }
    ],
});
// console.log(response.choices[0].message.content);
console.log(JSON.parse(response?.choices[0]?.message?.content));

