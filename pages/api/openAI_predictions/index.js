import { createOpenAiInstance } from "./createOpenAiInstance";

const openai = createOpenAiInstance();

// export default const generateImage = async (req, res) => {
//  export default const generateImage = async (req, res) => {
export default async function handler(req, res) {
    const { prompt, size } = req.body;

    const imageSize = "1024x1024";

    try {
        const response = await openai.createImage({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: imageSize,
        });

        const imageUrl = [response.data.data[0].url, response.data.data[0].url];
        
        res.status(200).json({
            success: true,
            imageUrl: imageUrl,
        });
    } catch (error) {
        if (error.response) {
            console.log('status = ', error.response.status);
            console.log('error = ', error.response.data);
        } else {
            console.log('message = ', error.message);
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong, unable to generate image"+ error.message,
        });
    }
};
