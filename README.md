# Documents AI
OpenAI + Nuxt tool to create conversational bot that can take your documentation as it's context. (embeddings)

Inspired by [Langchain.js LLM template](https://github.com/Conner1115/LangChain.js-LLM-Template)

## Setup

Install dependencies.
```bash
yarn install
```
Add your documents to docs folder.

Copy `.env.example` to `.env` and update OpenAI key.

Generate vector store.
```bash
yarn train
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
