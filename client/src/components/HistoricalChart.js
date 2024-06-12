import React from 'react';
import { Line } from 'react-chartjs-2';

const HistoricalChart = ({ historicalData, canvasId }) => {
  if (!historicalData || historicalData.length === 0) {
    return <div>No historical data available</div>;
  }

  const labels = historicalData.map(data => data.date); // Assuming date is the label field
  const closingPrices = historicalData.map(data => data.close);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Closing Price',
        data: closingPrices,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        lineTension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time', // Assuming the labels are time-based
      },
      y: {
        // Add any additional scale configuration here
      },
    },
  };

  return <Line id={canvasId} data={chartData} options={chartOptions} />;
};

export default HistoricalChart;
