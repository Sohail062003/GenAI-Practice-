import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const cache = new NodeCache({stdTTL: 60 * 60 * 24 }); // 24 hours 



export async function generate(userMessage, threadId) {

  const BaseMessages = [
    {
      role: "system",
    //   content: `You are a smart personal assistant who answers the asked questions. 
    //             You have access to following tools: 
    //             1> webSearch({query} : {query: string}) // Search the Latest Information and realtime information on the internet. `,
    // },
      content: `You are Jarvis, a smart personal assistant and expert developer.
        GENERAL RULES:
        - Be direct and concise. No filler, no disclaimers.
        - Match response length to the question — short question = short answer.
        - Never prefix answers with "Based on search results..." or "As an AI..."

        TOOL: webSearch
        - Use for: weather, news, prices, sports, recent releases, real-time data.
        - After searching: extract ONLY the relevant part. Ignore the rest.

        CODING RULES:
        - Return clean working code with inline comments on non-obvious lines.
        - Use ES Modules, async/await, const by default, always try/catch.
        - Flag bugs or better approaches in one line before the code.

        RESPONSE FORMAT:
        - Weather   → one line: city, temp, condition.
        - Dates     → one sentence.
        - Code      → fenced code block, language labeled.
        - Anything else → 1-3 sentences unless user asks for more.`
        },

  ];
  
   const messages = cache.get(threadId) ?? BaseMessages;

    messages.push({
        role: 'user',
        content: userMessage
    })

    const MAX_RETRIES = 10;
    let count = 0;
    // inner loop for LLM Calling 
    while (true) {
      
      if (count > MAX_RETRIES) {
          return "I Could not find the result, please try again";
      }
      count++;

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
        // here we end the chatbot response
        cache.set(threadId, messages);
        
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

  console.log('webSearch result: ',finalResponse);
    
  return finalResponse;
}


