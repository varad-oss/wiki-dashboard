// src/components/PageviewsChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// We have to register the components we want to use from Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const PageviewsChart = ({ pageviewsData }) => {
  const data = {
    // Format the date for the labels on the X-axis
    labels: pageviewsData.map(item => new Date(item.timestamp.substring(0, 8)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Page Views',
        // The actual view counts for the Y-axis
        data: pageviewsData.map(item => item.views),
        fill: true,
        backgroundColor: 'rgba(34, 211, 238, 0.2)', // cyan-400 with opacity
        borderColor: 'rgba(34, 211, 238, 1)', // cyan-400
        tension: 0.3,
        pointBackgroundColor: 'rgba(34, 211, 238, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Page Views (Last 30 Days)',
        color: '#e2e8f0', // slate-200
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        ticks: { color: '#94a3b8' }, // slate-400
        grid: { color: 'rgba(100, 116, 139, 0.2)' } // slate-500 with opacity
      },
      x: {
        ticks: { color: '#94a3b8' }, // slate-400
        grid: { display: false }
      },
    },
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg h-80">
      <Line options={options} data={data} />
    </div>
  );
};

export default PageviewsChart;