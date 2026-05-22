const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Имитация БД
const products = [
    { id: 1, name: 'Laptop', price: 1000 },
    { id: 2, name: 'Phone', price: 500 },
    { id: 3, name: 'Headphones', price: 100 }
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.listen(4000, () => console.log('Catalog Service running on port 4000'));