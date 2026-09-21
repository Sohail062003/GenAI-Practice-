import readLine from "node:readline/promises";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function generate(userMessage) {
 

  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions. 
                You have access to following tools: 
                1> webSearch({query} : {query: string}) // Search the Latest Information and realtime information on the internet. `,
    },

  ];

  // Outer Loop for user input

    messages.push({
        role: 'user',
        content: userMessage
    })

    // inner loop for LLM Calling 
    while (true) {
      const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b", // smallest on Groq free tier
        temperature: 0,
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the internet for latest or real-time information.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to perform.",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      messages.push(response.choices[0].message);

      const toolCalls = response.choices[0].message.tool_calls;

      // LLM genrated the response
      if (!toolCalls) {
        return response?.choices[0]?.message?.content;
      }

      for (const tool of toolCalls) {
        // console.log('tool: ', tool);
        const functionName = tool?.function?.name;
        const functionParams = tool?.function?.arguments;

        if (functionName === "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }
    }
  
}

// tool calling
async function webSearch({ query }) {
  console.log("caling web search...!");
  const response = await tvly.search(query);
  const finalResponse = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResponse;
}


