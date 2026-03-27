require('dotenv').config();
const express = require('express');
const prRoutes = require('./routes/purchaseRequests');
const auditRoutes = require('./routes/auditLogs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // frontend
  credentials: true // if you want to send cookies / auth headers
}));
app.use(express.json());
app.use('/api/purchase-requests', prRoutes);
app.use('/api/audit-logs', auditRoutes);

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('ERP API Running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));