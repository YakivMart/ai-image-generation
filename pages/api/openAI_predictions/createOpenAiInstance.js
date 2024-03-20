import { Configuration, OpenAIApi } from 'openai'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const createOpenAiInstance = () => {
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
    });

    return new OpenAIApi(configuration);
};
