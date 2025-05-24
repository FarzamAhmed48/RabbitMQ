const ampq = require("amqplib")

async function sendMail(){
    try {
        const connection = await ampq.connect("amqp://localhost")
        const channel = await connection.createChannel()
        const exchange = "mail_exchange";
        // const routingKey = "send_mail"
        const routingKeyForNormalUsers = "send_mail_to_users"
        const routingKeyForSubUsers = "send_mail_to_sub_users"

        const mail= {
            to:"realtime@gmail.com",
            from:"farzamahmed48@gmail.com",
            subject:"Mail Check",
            body:"Mein nahi bataonga"
        }
        await channel.assertExchange(exchange,"direct",{durable:false});
        // await channel.assertQueue("mail_queue",{durable:false})
        await channel.assertQueue("subscribed_user_queue",{durable:false})
        await channel.assertQueue("mail_for_users",{durable:false})
        // await channel.bindQueue("mail_queue",exchange,routingKey)
        await channel.bindQueue("mail_for_users",exchange,routingKeyForNormalUsers)
        await channel.bindQueue("subscribed_user_queue",exchange,routingKeyForSubUsers)

        // channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(mail)))
        channel.publish(exchange,routingKeyForNormalUsers,Buffer.from(JSON.stringify(mail)))
        channel.publish(exchange,routingKeyForSubUsers,Buffer.from(JSON.stringify(mail)))
        console.log("Mail data was sent!",mail)

        setTimeout(()=>{
            connection.close();
        },500)

    } catch (error) {
        console.log(error)
    }
}

sendMail()