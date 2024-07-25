import React, { useState, useEffect } from 'react';
import './trade.css'

function Trade() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [botRunning, setBotRunning] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecretKey, setApiSecretKey] = useState('');
  const [exchangeType, setExchangeType] = useState('binanceFutures');
  const [connected, setConnected] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [tradeDecision, setTradeDecision] = useState(null);
  const [futuresAssets, setFuturesAssets] = useState([]);
  const [tradingPairs, setTradingPairs] = useState([]);
  const [orderType, setOrderType] = useState('market');
  const [selectedPair, setSelectedPair] = useState('KSMUSDT');
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [orderTypes, setOrderTypes] = useState(['market', 'limit', 'trailing']);
  const [tradeResult, setTradeResult] = useState(null);
  const [tradeResultVisible, setTradeResultVisible] = useState(false);
  const [symbol, setSymbol] = useState('');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/usdt-balance', {
          headers: {
            'X-API-KEY': apiKey,
            'X-API-SECRET-KEY': apiSecretKey
          }
        });
        if (!response.ok) {
          throw new Error('Error fetching account info');
        }
        const data = await response.json();
        setAccountInfo(data.usdtBalance);
      } catch (error) {
        console.error('Error fetching account info:', error);
        setAccountInfo(null);
      }
    };

    const fetchTradeDecision = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/trade-decision?symbol=${selectedPair}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trading decision');
        }
        const { decision } = await response.json();
        setTradeDecision(decision);
      } catch (error) {
        console.error('Error fetching trade decision:', error);
        setTradeDecision(null);
      }
    };
    
    const fetchTradingPairs = async () => {
      try {
        const response = await fetch('https://fapi.binance.com/fapi/v1/exchangeInfo');
        if (!response.ok) {
          throw new Error('Failed to fetch trading pairs');
        }
        const data = await response.json();
        const pairs = data.symbols.map(symbol => symbol.symbol);
        setTradingPairs(pairs);
      } catch (error) {
        console.error('Error fetching trading pairs:', error);
        setTradingPairs([]);
      }
    };

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/historical-data/${selectedPair}`);
        if (!response.ok) {
          throw new Error('Failed to fetch historical data');
        }
        const data = await response.json();
        console.log('Historical data:', data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    if (botRunning && connected) {
      fetchAccountInfo();
      fetchTradeDecision();
      fetchTradingPairs();
      fetchHistoricalData();
      const intervalId = setInterval(() => {
        fetchAccountInfo();
        fetchTradeDecision();
        fetchTradingPairs();
        fetchHistoricalData();
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [botRunning, connected, apiKey, apiSecretKey, selectedPair]);

  useEffect(() => {
    if (tradeDecision && botRunning && connected) {
      executeTrade();
    }
  }, [tradeDecision, botRunning, connected]);

  const startBot = () => {
    setBotRunning(true);
  };

  const stopBot = () => {
    setBotRunning(false);
    setAccountInfo(null);
  };

  const connectExchange = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/set-api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          exchangeType: exchangeType === 'binanceFutures' ? 'binancefutures' : 'binance',
          apiKey,
          apiSecretKey
        })
      });
      if (!response.ok) {
        throw new Error('Failed to connect to exchange');
      }
      const data = await response.json();
      setConnected(true);
      setAccountId(data.accountId);
    } catch (error) {
      console.error('Error connecting to exchange:', error);
      setConnected(false);
      setAccountId(null);
    }
  };

  const disconnectExchange = () => {
    setConnected(false);
    setAccountId(null);
    setAccountInfo(null);
  };

  const executeTrade = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/execute-trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                apiKey, 
                symbol,
                apiSecretKey, 
                tradeDecision, 
                orderType,
                selectedPair 
            })
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error('Failed to execute trade');
        }
        console.log('Trade executed successfully:', data.tradeResult);
        setTradeResult(data.tradeResult);
    } catch (error) {
        console.error('Error executing trade:', error);
        setTradeResult(null);
    }
};

  useEffect(() => {
    if (tradeResult) {
      setTradeResultVisible(true);
      console.log('Trade Result:', tradeResult);
      alert(`Trade executed: ${JSON.stringify(tradeResult)}`);
    }
  }, [tradeResult]);

  return (
    <div className="trade">
      <h1 className='botTitle'>FreeDom</h1>
      <div className='apiKey'>
        <label>
          <h5>API Key:</h5>
          <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API Key" />
        </label>
        <label>
          <h5>API Secret Key:</h5>
          <input type="password" value={apiSecretKey} onChange={(e) => setApiSecretKey(e.target.value)} placeholder="Enter API Secret Key" />
        </label>
        <div className='exchangeType'>
          <label>
            <h5>Exchange Type:</h5>
            <select className="Exchange" value={exchangeType} onChange={(e) => setExchangeType(e.target.value)}>
              <option value="spot">Binance Spot Trading</option>
              <option value="binanceFutures">Binance Futures Trading</option>
            </select>
          </label>
          {!connected ? (
            <button onClick={connectExchange} className='connectBtt'>Connect Exchange</button>
          ) : (
            <>
              <button onClick={disconnectExchange} className='connectBtt'>Disconnect Exchange</button>
              {accountId && <p>Connected to Binance (Account ID: {accountId})</p>}
              {!accountId && <p>Connected to Binance</p>}
            </>
          )}
        </div>
      </div>
      <div className='TradingOption'>
        <h5>Trading Options</h5>
        <label>
          <h5>Trading Pair:</h5>
          <select className="paire"value={selectedPair} onChange={(e) => {
            setSelectedPair(e.target.value);
            setSymbol(e.target.value); // Update the symbol state
           }}>
           {tradingPairs.map(pair => (
           <option key={pair} value={pair}>{pair}</option>
           ))}
          </select>
        </label>
 
        <label>
          <h5>Order Type:</h5>
          <select className="oders" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            {orderTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <h5>Bot Control</h5>
        {!botRunning ? (
          <button onClick={startBot}>Start Bot</button>
        ) : (
          <>
            <button onClick={stopBot}>Stop Bot</button>
          </>
        )}
        {tradeDecision && (
          <p>Trade Decision: {tradeDecision}</p>
        )}
        {tradeResultVisible && (
          <div className="TradeResult">
            <h2>Trade Result</h2>
            <p>{JSON.stringify(tradeResult)}</p>
          </div>
        )}
      </div>
      {showAccountInfo && accountInfo && (
        <div className='Account'>
          <h5>Account Information</h5>
          {/* Placeholder for additional account information */}
          <p>Asset: {accountInfo.asset}</p>
          <p>Wallet Balance: {accountInfo.walletBalance}</p>
          <p>Unrealized Profit: {accountInfo.unrealizedProfit}</p>
          <p>Margin Balance: {accountInfo.marginBalance}</p>
          <p>Position Initial Margin: {accountInfo.positionInitialMargin}</p>
          <p>Open Order Initial Margin: {accountInfo.openOrderInitialMargin}</p>
        </div>
      )}
      <button onClick={() => setShowAccountInfo(!showAccountInfo)}>
        {showAccountInfo ? 'Hide Account Info' : 'Show Account Info'}
      </button>
    </div>
  );
}

export default Trade;
