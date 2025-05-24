const amqp = require("amqplib")

const recvMail = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = "notification_exchange"
        const queue = "payment_queue"
        await channel.assertExchange(exchange, "topic", { durable: true })
        await channel.assertQueue(queue, { durable: true })

        await channel.bindQueue(queue,exchange,"payment.*")
        console.log("Waiting For messages...")
        channel.consume(queue, (message) => {
            if (message !== null) {
                console.log('Received Payment Notification:', JSON.parse(message.content));
                channel.ack(message)
            }
        },
            { noAck: false })
    } catch (error) {
        console.log(error)
    }
}

recvMail()