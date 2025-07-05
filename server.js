const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let products = [];

function generateRandomId() {
    return Math.floor(Math.random() * 10000);
}

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST new product
app.post('/products', (req, res) => {
  const { productName, cost, stockStatus } = req.body;
  const allowedStatuses = ['in-stock', 'low-stock', 'out-of-stock'];

  if (!allowedStatuses.includes(stockStatus)) {
    return res.status(400).json({ error: 'Invalid stock status' });
  }

  const newProduct = {
    id: generateRandomId(),
    productName,
    cost,
    stockStatus,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH to edit product (excluding stock status)
app.patch('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { productName, cost } = req.body;

  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  if (productName) product.productName = productName;
  if (cost) product.cost = cost;

  res.json(product);
});

// PATCH to change stock status only
app.patch('/products/:id/:status', (req, res) => {
  const id = parseInt(req.params.id);
  const newStatus = req.params.status;
  const allowedStatuses = ['in-stock', 'low-stock', 'out-of-stock'];

  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid stock status' });
  }

  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  product.stockStatus = newStatus;
  res.json(product);
});

//DELETE product by ID
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products.splice(index, 1);
  res.json({ message: 'Product deleted' });
});

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});