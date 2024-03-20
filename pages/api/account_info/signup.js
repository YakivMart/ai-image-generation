import prisma from '../../../lib/prisma';

export default async function handler(req, res) {

    try {
        const { wallet_address } = req.body;
        const response = await prisma.info.create({
            data: {
                wallet_address: wallet_address,
                free_image_amount: 0,
                paid_image_amount: 0,
                free_chat_time: 300,
                paid_chat_time: 0,
            },
        });

        res.send(response);
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
