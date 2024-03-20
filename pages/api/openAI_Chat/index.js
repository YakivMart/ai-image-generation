import { createOpenAiInstance } from "../openAI_predictions/createOpenAiInstance";

const openai = createOpenAiInstance();
const maxTokens = 3000;

export default async function handler(req, res) {

    try {

        const { message } = req.body;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message,
            max_tokens: maxTokens,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        if (response.data.choices[0].text) {
            res.send(JSON.stringify({
                message: response.data.choices[0].text
            }));
        }

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
