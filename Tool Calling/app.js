import readLine from "node:readline/promises";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });  
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });  

async function main() {
 
  const rl = readLine.createInterface({ input: process.stdin, output: process.stdout });  

  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant who answers the asked questions. 
                You have access to following tools: 
                1> webSearch({query} : {query: string}) // Search the Latest Information and realtime information on the internet. `,
    },
    // {
    //   role: "user",
    //   content: "what is the current weather in mumbai",
    //   // content: "when was the iphone 17 launched?",
    //   // content: "What is the current wheather in New York City?"
    // },
  ];

  // Outer Loop for user input
  while (true) {

    const question = await rl.question('You:');

    if (question === 'bye') {
        break;
    }

    messages.push({
        role: 'user',
        content: question
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
        console.log(response?.choices[0]?.message?.content);
        break;
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
  rl.close();
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

main();
