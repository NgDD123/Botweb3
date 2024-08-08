import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './checkout.css';

const CheckoutPage = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [invoice, setInvoice] = useState('');
  const [custom, setCustom] = useState('');
  const [ipnUrl, setIpnUrl] = useState('');
  const [successUrl, setSuccessUrl] = useState('');
  const [cancelUrl, setCancelUrl] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const MINIMUM_AMOUNT = 10;
  const BTC_ADDRESS = process.env.REACT_APP_BTC_RECEIVING_ADDRESS;
  const USDT_BINANCE_ADDRESS = process.env.REACT_APP_USDT_RECEIVING_ADDRESS;

  const handlePayment = async () => {
    if (amount < MINIMUM_AMOUNT) {
      setMessage(`The minimum amount to pay is ${MINIMUM_AMOUNT}`);
      return;
    }

    try {
      const response = await axios.post('/api/process-payment', {
        amount,
        userId,
        currency1: currency,
        currency2: currency,
        address: getPaymentAddress(),
        ipn_url: ipnUrl,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      setMessage(response.data.message);
      setPaymentId(response.data.paymentId);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error initiating payment');
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentId) {
      setMessage('No payment ID to check');
      return;
    }

    try {
      const response = await axios.get(`/api/payment-status/${paymentId}`);
      setPaymentStatus(response.data.status);
      if (response.data.status === 'PAID') {
        navigate('/');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error checking payment status');
    }
  };

  const getPaymentAddress = () => {
    return currency === 'BTC' ? BTC_ADDRESS : USDT_BINANCE_ADDRESS;
  };

  return (
    <div className='container'>
      <div className='checkout'>
        <h1>Checkout Page</h1>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            User ID:
            <input
              type="text"
              value={userId}
              readOnly
            />
          </label>
        </div>
        <div>
          <label>
            Currency:
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="BTC">BTC</option>
              <option value="USDT">USDT (Binance)</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Success URL:
            <input
              type="text"
              value={successUrl}
              onChange={(e) => setSuccessUrl(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Cancel URL:
            <input
              type="text"
              value={cancelUrl}
              onChange={(e) => setCancelUrl(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handlePayment}>Process Payment</button>
        <div>
          <p>{message}</p>
          {paymentId && (
            <div>
              <p>Payment Address: {getPaymentAddress()}</p>
              <button onClick={checkPaymentStatus}>Check Payment Status</button>
              <p>Payment Status: {paymentStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
