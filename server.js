import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/products', (req, res) => {
    fs.readFile('products.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading products data');
        } else {
            const products = JSON.parse(data);
            res.json(products);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
