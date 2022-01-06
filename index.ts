import "dotenv/config";
import amqp from "amqplib/callback_api";

import store, { Notification } from "./src/store";
import dispatcher from "./src/dispatch";

const rabbitConn = process.env.RABBITMQ_CONN as string;
amqp.connect(rabbitConn, async (err, connection) => {
  if (err) throw err;

  await store.connect();

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = 'notification';

    channel.assertQueue(queue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, async (msg) => {
      try {
        const content = msg?.content?.toString()
        console.log(" [x] Received %s", content);

        const notification = JSON.parse(content as string) as Notification;

        await dispatcher.dispatch(notification);
      } catch (e) {
        console.error(e);
      }
    }, { noAck: true })
  })
})
