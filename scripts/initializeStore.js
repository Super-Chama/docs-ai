import fs from "fs";
import glob from "glob";
import dotenv from "dotenv";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { CharacterTextSplitter } from "langchain/text_splitter";

dotenv.config();

const data = [];
const files = await new Promise((resolve, reject) =>
  glob("docs/**/*.md", (err, files) => (err ? reject(err) : resolve(files)))
);

for (const file of files) {
  data.push(fs.readFileSync(file, "utf-8"));
}

console.log(
  `Added ${files.length} files to data.  Splitting text into chunks...`
);

const textSplitter = new CharacterTextSplitter({
  chunkSize: 2000,
  separator: "\n",
});

let docs = [];
for (const d of data) {
  const docOutput = await textSplitter.splitText(d);
  docs = [...docs, ...docOutput];
}

console.log("Initializing Store...");

const store = await HNSWLib.fromTexts(
  docs,
  docs.map((_, i) => ({ id: i })),
  new OpenAIEmbeddings({
    openAIApiKey: process.env.NUXT_OPENAI_API_KEY,
  })
);

console.clear();
console.log("Saving Vectorstore");

store.save("vectorStore");

console.clear();
console.log("VectorStore saved");
