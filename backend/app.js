const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connection');
const path = require('path');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas futuras
// app.use('/api/products', require('./routes/products'));
// app.use('/api/sales', require('./routes/sales'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/coupons', require('./routes/coupons'));
// app.use('/api/notifications', require('./routes/notifications'));
// app.use('/api/affiliates', require('./routes/affiliates'));
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); 