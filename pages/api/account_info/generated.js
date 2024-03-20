import prisma from '../../../lib/prisma';

export default async function handler(req, res) {

    try {
        const { type, wallet_address } = req.body;
        if (type == 1) {
            const response_get = await prisma.info.findUnique({
                where: { wallet_address: wallet_address },
                select: {
                    free_image_amount: true,
                },
            });
            const response = await prisma.info.update({
                where: { wallet_address: wallet_address },
                data: {
                    free_image_amount: response_get.free_image_amount - 1,
                },
            });
        } else if (type == 2) {
            const response_get = await prisma.info.findUnique({
                where: { wallet_address: wallet_address },
                select: {
                    paid_image_amount: true,
                },
            });
            const response = await prisma.info.update({
                where: { wallet_address: wallet_address },
                data: {
                    paid_image_amount: response_get.paid_image_amount - 1,
                },
            });
        } else if (type == 3) {
            const response_get = await prisma.info.findUnique({
                where: { wallet_address: wallet_address },
                select: {
                    free_chat_time: true,
                },
            });
            const response = await prisma.info.update({
                where: { wallet_address: wallet_address },
                data: {
                    free_chat_time: response_get.free_chat_time - 60,
                },
            });
        } else if (type == 4) {
            const response_get = await prisma.info.findUnique({
                where: { wallet_address: wallet_address },
                select: {
                    paid_chat_time: true,
                },
            });
            const response = await prisma.info.update({
                where: { wallet_address: wallet_address },
                data: {
                    paid_chat_time: response_get.paid_chat_time - 60,
                },
            });
        }
        res.send("success");
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
