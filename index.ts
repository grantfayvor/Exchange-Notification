import amqp from "amqplib/callback_api";
import dotenv from "dotenv";

dotenv.config();

const rabbitConn = process.env.RABBITMQ_CONN as string;
amqp.connect(rabbitConn, (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = 'notification';

    channel.assertQueue(queue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, (msg) => {
      console.log(" [x] Received %s", msg?.content?.toString());
    }, { noAck: true })
  })
})
