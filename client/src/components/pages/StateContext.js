// StateContext.js
import React, { createContext, useState } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [state, setState] = useState({
    accountInfo: null,
    botRunning: false,
    apiKey: '',
    apiSecretKey: '',
    exchangeType: 'binanceFutures',
    connected: false,
    accountId: null,
    tradeDecision: null,
    futuresAssets: [],
    tradingPairs: [],
    orderType: 'market',
    selectedPair: 'KSMUSDT',
    showAccountInfo: false,
    orderTypes: ['market', 'limit', 'trailing'],
    tradeResult: null,
    tradeResultVisible: false,
    symbol: '',
    // Checkout Page states
    amount: '',
    message: '',
    paymentId: '',
    paymentStatus: '',
    currency: 'BTC',
    invoice: '',
    custom: '',
    ipnUrl: '',
    successUrl: '',
    cancelUrl: '',
    userId: null,
  });

  const setCheckoutState = (newState) => {
    setState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  return (
    <StateContext.Provider value={{ state, setState, setCheckoutState }}>
      {children}
    </StateContext.Provider>
  );
};
