const amqp = require('amqplib');

const EXCHANGE_NAME = 'ecommerce_events';

async function start() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    const channel = await conn.createChannel();
    
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
    
    // Создаем уникальную очередь для этого инстанса
    const q = await channel.assertQueue('', { exclusive: true });
    
    console.log(`Waiting for messages in queue: ${q.queue}`);
    
    channel.bindQueue(q.queue, EXCHANGE_NAME, '');
    
    channel.consume(q.queue, (msg) => {
        if (msg.content) {
            const order = JSON.parse(msg.content.toString());
            console.log(`[NOTIFICATION] Sending email to user ${order.userId} for order ${order.id}`);
            console.log(`[NOTIFICATION] Email body: "Thanks for buying ${order.items.length} items!"`);
        }
    }, { noAck: true });
}

start().catch(console.error);