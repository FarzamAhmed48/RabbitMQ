const ampq = require("amqplib")

const sendMail=async(routingKey,mail)=>{
    try {
        const connection = await ampq.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = "notification_exchange";
        // const routingKey = "send_mail"
        const exchangeType = "topic"


        await channel.assertExchange(exchange,exchangeType,{durable:true});


        // channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(mail)))
        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(mail)),{persistent:true})
        console.log("[x] Sent '%s':'%s'",routingKey,JSON.stringify(mail))
        console.log(`Mail data was sent! with the routing key as ${routingKey} and message ${mail}`)

        setTimeout(()=>{
            connection.close();
        },500)

    } catch (error) {
        console.log(error)
    }
}

sendMail("order.placed",{orderId:12345,status:"placed"})
sendMail("payment.processed",{paymentId:67890,status:"processed"})