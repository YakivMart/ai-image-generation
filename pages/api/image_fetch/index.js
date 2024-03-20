
import axios from 'axios';
export default async function handler(req, res) {

    try {

        const { imageSrc } = req.body;
        const imageResponse = await axios.get(imageSrc, { responseType: 'arraybuffer' });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'image/png');
        res.send(imageResponse.data);

    } catch (error) {
        if (error.response) {
            //console.log(error.response.status);
            //console.log(error.response.data);
        } else {
            //console.log(error.message);
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong, unable to download image",
        });
    }
};
