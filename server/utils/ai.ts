import { basePrompt } from "@/server/utils/prompt";
import { HNSWLib } from "langchain/vectorstores";
import { ChatOpenAI } from "langchain/chat_models";
import { LLMChain, PromptTemplate } from "langchain";
import { OpenAIEmbeddings } from "langchain/embeddings";

const config = useRuntimeConfig();

const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: config.openaiApiKey,
  modelName: "gpt-3.5-turbo",
});

// Parse and initialize the Prompt
const prompt = new PromptTemplate({
  template: basePrompt,
  inputVariables: ["history", "context", "prompt"],
});

// Create the LLM Chain
const llmChain = new LLMChain({
  llm: chat,
  prompt,
});

export const createStore = async () => {
  return HNSWLib.load(
    "vectorStore",
    new OpenAIEmbeddings({
      openAIApiKey: config.openaiApiKey,
    })
  );
};

export const generateResponse = async (
  store: HNSWLib,
  {
    history,
    prompt,
  }: {
    history: string[];
    prompt: string;
  }
) => {
  // Search for related context/documents in the vectorStore directory
  const data = await store.similaritySearch(prompt, 1);
  const context: string[] = [];
  data.forEach((item) => {
    context.push(`Context:\n${item.pageContent}`);
  });

  return await llmChain.predict({
    prompt,
    context: context.join("\n\n"),
    history,
  });
};
