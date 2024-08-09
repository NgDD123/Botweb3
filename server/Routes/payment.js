const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Payment processing route
router.post('/process-payment', async (req, res) => {
  const {
    amount,
    userId,
    currency1,
    currency2,
    address,
    ipn_url,
    success_url,
    cancel_url,
  } = req.body;

  try {
    // Validate amount and currency
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided' });
    }

    // Prepare the payload for CoinPayments API
    const payload = {
      amount: parsedAmount,
      currency1,
      currency2,
      address,
      ipn_url,
      success_url,
      cancel_url,
      cmd: 'create_transaction',
      key: process.env.COINPAY_API_KEY,
      version: 1,
    };

    // Convert payload to URL-encoded string
    const payloadString = qs.stringify(payload);

    // Generate HMAC signature
    const hmac = crypto.createHmac('sha512', process.env.COINPAY_API_SECRET);
    hmac.update(payloadString);
    const signature = hmac.digest('hex');

    // Process payment with CoinPayments
    const response = await axios.post('https://www.coinpayments.net/api.php', payloadString, {
      headers: {
        'HMAC': signature,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (response.data.error !== 'ok') {
      throw new Error(response.data.error);
    }

    const paymentRequest = response.data.result;
    const paymentId = paymentRequest.txn_id;

    res.json({ message: 'Payment processed successfully', paymentId });

  } catch (error) {
    console.error('Error processing payment:', error.message);
    res.status(500).json({ error: 'Error processing payment' });
  }
});

// Payment status route
router.get('/payment-status/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payload = {
      cmd: 'get_tx_info',
      key: process.env.COINPAY_API_KEY,
      txn_id: paymentId,
      version: 1,
    };

    const payloadString = qs.stringify(payload);
    const hmac = crypto.createHmac('sha512', process.env.COINPAY_API_SECRET);
    hmac.update(payloadString);
    const signature = hmac.digest('hex');

    const response = await axios.post('https://www.coinpayments.net/api.php', payloadString, {
      headers: {
        'HMAC': signature,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (response.data.error !== 'ok') {
      throw new Error(response.data.error);
    }

    const paymentStatus = response.data.result;

    res.json({ status: paymentStatus.status_text });

  } catch (error) {
    console.error('Error checking payment status:', error.message);
    res.status(500).json({ error: 'Error checking payment status' });
  }
});

module.exports = router;
