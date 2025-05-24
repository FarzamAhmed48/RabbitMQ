const amqp = require("amqplib")

async function recvMail() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        // await channel.assertQueue("mail_queue",{durable:false})
        await channel.assertQueue("mail_for_users", { durable: false })
        channel.consume("mail_for_users", (message) => {
            if (message !== null) {
                console.log('Received Message for nomral user', JSON.parse(message.content));
                channel.ack(message)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

recvMail()