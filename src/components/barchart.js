//not working at the moment

import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';


const BarChart = ({ data, options }) => {
  const chartRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);

  const [chartData, setChartData] = useState(data);

  const updateTheme = () => {
    const theme = localStorage.getItem('theme');
    setDarkMode(theme === 'dark');
    updateChartColors();
    //update the chartref
    console.log(chartRef.current.chartInstance.update());
  };

  useEffect(() => {
    updateTheme();
    window.addEventListener('storage', updateTheme);

    return () => {
      window.removeEventListener('storage', updateTheme);
    };
  }, []);

  const updateChartColors = (chartInstance) => {
    console.log('run');
    const colors = darkMode ? ['#a5b4fc', '#93c5fd', '#3b82f6', '#9333ea', '#f97316'] : ['#3b82f6', '#9333ea', '#f97316', '#10b981', '#ec4899'];
    // chartInstance.data.datasets[0].backgroundColor = colors;
    // chartInstance.update();
  };

  useEffect(() => {
    if (chartRef.current && chartRef.current.chartInstance) {
      updateChartColors(chartRef.current.chartInstance);
    }
  }, [darkMode]);

  const handleChartLoad = (chartInstance) => {
    console.log('handleChartLoad');
    updateChartColors(chartInstance);
  };

  return (
    <div>
      <Bar ref={chartRef} data={chartData} options={options} onLoadStart={handleChartLoad} />
    </div>
  );
};

export default BarChart;