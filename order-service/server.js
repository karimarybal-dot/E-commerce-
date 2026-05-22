const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

let channel;
const EXCHANGE_NAME = 'ecommerce_events';
 
async function connectRabbitMQ() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
    console.log('Connected to RabbitMQ');
}

connectRabbitMQ();

app.post('/orders', async (req, res) => {
    const { userId, items } = req.body;

    const orderId = uuidv4();
    const order = {
        id: orderId,
        userId,
        items,
        status: 'CREATED',
        createdAt: new Date()
    };
    
    console.log(`Order created: ${orderId}`);


    if (channel) {
        const message = JSON.stringify(order);
        channel.publish(EXCHANGE_NAME, '', Buffer.from(message));
        console.log(`Event published: OrderCreated for ${orderId}`);
    }

    res.status(201).json(order);
});

app.listen(5000, () => console.log('Order Service running on port 5000'));const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

let channel;
const EXCHANGE_NAME = 'ecommerce_events';


async function connectRabbitMQ() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
    console.log('Connected to RabbitMQ');
}

connectRabbitMQ();

app.post('/orders', async (req, res) => {
    const { userId, items } = req.body;
    

    const orderId = uuidv4();
    const order = {
        id: orderId,
        userId,
        items,
        status: 'CREATED',
        createdAt: new Date()
    };
    
    console.log(`Order created: ${orderId}`);

    if (channel) {
        const message = JSON.stringify(order);
        channel.publish(EXCHANGE_NAME, '', Buffer.from(message));
        console.log(`Event published: OrderCreated for ${orderId}`);
    }

    res.status(201).json(order);
});

app.listen(5000, () => console.log('Order Service running on port 5000'));