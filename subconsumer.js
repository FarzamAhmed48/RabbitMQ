const amqp = require("amqplib")

async function recvMail() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        // await channel.assertQueue("mail_queue",{durable:false})
        await channel.assertQueue("subscribed_user_queue", { durable: false })

        channel.consume("subscribed_user_queue", (message) => {
            if (message !== null) {
                console.log('Received Message for subscribed users', JSON.parse(message.content));
                channel.ack(message)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

recvMail()