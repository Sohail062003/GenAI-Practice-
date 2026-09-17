import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

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

    // response_format: {
    //     type: 'json_schema',
    //     json_schema: {
    //         name: 'sentiment_schema',
    //         schema: {
    //             type: 'object',
    //             properties: {
    //                 sentiment: {
    //                     type: 'string',
    //                     enum: ['Positive', 'Neutral', 'Negative'],
    //                 }
    //             },
    //             required: ['sentiment']
    //         }
    //     }
    // },

    // sql query generation schema
    // response_format: {
    // type: "json_schema",
    // json_schema: {
    //   name: "sql_query_generation",
    //   schema: {
    //     type: "object",
    //     properties: {
    //       query: { type: "string" },
    //       query_type: { 
    //         type: "string", 
    //         enum: ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP"] 
    //       },
    //       tables_used: {
    //         type: "array",
    //         items: { type: "string" }
    //       },
    //       estimated_complexity: {
    //         type: "string",
    //         enum: ["low", "medium", "high"]
    //       },
    //       execution_notes: {
    //         type: "array",
    //         items: { type: "string" }
    //       },
    //       validation_status: {
    //         type: "object",
    //         properties: {
    //           is_valid: { type: "boolean" },
    //           syntax_errors: {
    //             type: "array",
    //             items: { type: "string" }
    //           }
    //         },
    //         required: ["is_valid", "syntax_errors"],
    //         additionalProperties: false
    //       }
    //     },
    //     required: ["query", "query_type", "tables_used", "estimated_complexity", "execution_notes", "validation_status"],
    //     additionalProperties: false
    //   }
    // }
    // },
    
    messages: [
        {
            role: 'system',
            // content: `You are a jarvis, a smart review grader. Your task is to analyse given review and return the sentiment. 
            // Classify the review as positve, Netural or negative. You must return the result in Valid JSON Sturcture.
            // example: {"sentiment" : "Negative"} 
            // `
            // content: `You are a Jarvis, a smart code assistant. Your task is to analyze problem and generate a solution in code.`
            // content: "You are a SQL expert. Generate structured SQL queries from natural language descriptions with proper syntax validation and metadata.",
            content: "You are a Jarvis assistant. you must provide a information to any thing.",
        },
        {
            role: 'user',
            // content: `Review: These headphones arrived quickly and look great.
            // Sentiment:
            // ` 
            //content: `Problem: Write a function in JavaScript that takes an array of numbers and returns the sum of all even numbers in the array.`
            // content: "Find all customers who made orders over $500 in the last 30 days, show their name, email, and total order amount"
            content: "when was the ipone 17 is launched?",
        }
    ],
});
// console.log(response.choices[0].message.content);
console.log(JSON.parse(response?.choices[0]?.message?.content));

