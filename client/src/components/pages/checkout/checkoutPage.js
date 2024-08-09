import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { StateContext } from '../StateContext';
import './checkout.css';

const CheckoutPage = () => {
  const { state, setCheckoutState } = useContext(StateContext);
  const {
    amount,
    message,
    paymentId,
    paymentStatus,
    currency,
    successUrl,
    cancelUrl,
    userId,
  } = state;

  const navigate = useNavigate();

  const MINIMUM_AMOUNT = 10;
  const BTC_ADDRESS = process.env.REACT_APP_BTC_RECEIVING_ADDRESS;
  const USDT_COINPAYMENTS_ADDRESS = process.env.REACT_APP_COINPAYMENTS_USDT_TRON_ADDRESS;

  const handlePayment = async () => {
    if (amount < MINIMUM_AMOUNT) {
      setCheckoutState({ message: `The minimum amount to pay is ${MINIMUM_AMOUNT}` });
      return;
    }

    try {
      const response = await axios.post('/api/process-payment', {
        amount,
        userId,
        currency1: currency,
        currency2: currency,
        address: getPaymentAddress(),
        ipn_url: state.ipnUrl,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      setCheckoutState({ 
        message: response.data.message, 
        paymentId: response.data.paymentId 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error initiating payment';
      setCheckoutState({ message: errorMessage });
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentId) {
      setCheckoutState({ message: 'No payment ID to check' });
      return;
    }

    try {
      const response = await axios.get(`/api/payment-status/${paymentId}`);
      setCheckoutState({ paymentStatus: response.data.status });
      if (response.data.status === 'Complete') {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error checking payment status';
      setCheckoutState({ message: errorMessage });
    }
  };

  const getPaymentAddress = () => {
    return currency === 'BTC' ? BTC_ADDRESS : USDT_COINPAYMENTS_ADDRESS;
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
              onChange={(e) => setCheckoutState({ amount: e.target.value })}
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
            <select value={currency} onChange={(e) => setCheckoutState({ currency: e.target.value })}>
              <option value="BTC">BTC</option>
              <option value="USDT">USDT (TRON - CoinPayments)</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Success URL:
            <input
              type="text"
              value={successUrl}
              onChange={(e) => setCheckoutState({ successUrl: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Cancel URL:
            <input
              type="text"
              value={cancelUrl}
              onChange={(e) => setCheckoutState({ cancelUrl: e.target.value })}
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
