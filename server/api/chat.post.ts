import { createStore, generateResponse } from "@/server/utils/ai";

export default defineLazyEventHandler(async () => {
  // perform one-off set up tasks here

  const store = await createStore();
  console.clear();
  console.log("Store created");

  // return event handler that will be called for each request
  return defineEventHandler(async (event) => {
    const { prompt, history } = await readBody<{
      prompt: string;
      history: string[];
    }>(event);

    if (!prompt) {
      throw createError({
        statusCode: 400,
        statusMessage: "A valid prompt is required!",
      });
    }

    const response = await generateResponse(store, {
      history: history.slice(-5),
      prompt: prompt,
    });

    return {
      prompt,
      response,
    };
  });
});
