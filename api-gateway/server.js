const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const CATALOG_URL = process.env.CATALOG_URL || 'http://localhost:4000';
const ORDER_URL = process.env.ORDER_URL || 'http://localhost:5000';

// Маршруты каталога
app.get('/products', async (req, res) => {
    try {
        const response = await axios.get(`${CATALOG_URL}/products`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Catalog service error' });
    }
});

// Маршруты заказов
app.post('/orders', async (req, res) => {
    try {
        const response = await axios.post(`${ORDER_URL}/orders`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Order service error' });
    }
});

app.listen(3000, () => console.log('API Gateway running on port 3000'));