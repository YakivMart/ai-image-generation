import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    console.log("buy started");

    try {
        const { type, wallet_address, expire_date, price } = req.body;
        console.log("type: ", type);
        console.log("wallet address: ", wallet_address);
        console.log('expire date: ', expire_date);
        console.log("price: ", price);


        if (type <= 4) {
            console.log("1111111111");
            if (price % 3 == 0) {
                console.log("222222222");

                const response_get = await prisma.info.findUnique({
                    where: { wallet_address: wallet_address },
                    select: {
                        paid_image_amount: true,
                    },
                });
                console.log('2.555', response_get)
                const response = await prisma.info.update({
                    where: { wallet_address: wallet_address },
                    data: {
                        paid_image_amount: response_get.paid_image_amount + price / 3,
                    },
                });
            } else {
                console.log("333333");

                const response = await prisma.info.update({
                    where: { wallet_address: wallet_address },
                    data: {
                        expire_date: expire_date,
                    },
                });
            }

        } else if (type == 5) {
            console.log("4444444444");

            const response_get = await prisma.info.findUnique({
                where: { wallet_address: wallet_address },
                select: {
                    paid_chat_time: true,
                },
            });
            const response = await prisma.info.update({
                where: { wallet_address: wallet_address },
                data: {
                    paid_chat_time: response_get.paid_chat_time + (price / 10) * 3600,
                    expire_date: expire_date,
                },
            });
        }
        console.log("5555555555");

        res.send("success");
    } catch (error) {
        console.log("66666666666");

        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
