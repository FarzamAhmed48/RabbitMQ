const ampq = require("amqplib")

async function sendMail(){
    try {
        const connection = await ampq.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = "mail_exchange";
        const routingKey = "send_mail"

        const mail= {
            to:"realtime@gmail.com",
            from:"farzamahmed48@gmail.com",
            subject:"Mail Check",
            body:"Mein nahi bataonga"
        }
        await channel.assertExchange(exchange,"direct",{durable:false});
        await channel.assertQueue("mail_queue",{durable:false})

        await channel.bindQueue("mail_queue",exchange,routingKey)

        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(mail)))
        console.log("Mail data was sent!",mail)

        setTimeout(()=>{
            connection.close();
        },500)

    } catch (error) {
        console.log(error)
    }
}

sendMail()