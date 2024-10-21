// src/components/PopulationChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './PopulationChart.css'; // Новый CSS файл для стилизации

const PopulationChart = ({ history }) => {
  const limitedHistory = history.slice(-100); // Ограничение до 100 записей
  const labels = limitedHistory.map(entry => entry.time);
  const species = ['grass', 'bushes', 'trees', 'rabbits', 'wolves'];
  const colors = {
    grass: 'green',
    bushes: 'brown',
    trees: 'darkgreen',
    rabbits: 'gray',
    wolves: 'red',
  };

  const data = {
    labels: labels,
    datasets: species.map(species => ({
      label: capitalize(species),
      data: limitedHistory.map(entry => entry[species]),
      borderColor: colors[species],
      backgroundColor: `${colors[species]}33`, // Полупрозрачный цвет
      fill: false,
      tension: 0.1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Время (шаги)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Популяция',
        },
      },
    },
  };

  return (
    <div className="population-chart-container">
      <h2>Популяции Экосистемы во Времени</h2>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

// Функция для капитализации первой буквы
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default PopulationChart;