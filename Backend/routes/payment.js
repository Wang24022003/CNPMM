const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { checkout, paymentVerification } = require('./controller/paymentCtrl');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// Define routes
app.post('/api/user/order/checkout', checkout); // Unified checkout route
app.get('/api/user/order/vnpay_return', paymentVerification);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
