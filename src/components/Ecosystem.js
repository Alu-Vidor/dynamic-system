// src/components/Ecosystem.js
import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import Suggestions from './Suggestions';
import PopulationChart from './PopulationChart';
import PopulationMap from './PopulationMap';
import * as tf from '@tensorflow/tfjs';
import './Ecosystem.css'; // Убедитесь, что этот файл существует

const MAP_WIDTH = 800; // Увеличенная ширина карты
const MAP_HEIGHT = 500; // Увеличенная высота карты

const INITIAL_POPULATIONS = {
  grass: 200,
  bushes: 100,
  trees: 50,
  rabbits: 80,
  wolves: 30,
};

const INITIAL_MAP = {
  grass: Array.from({ length: 200 }, () => ({
    x: Math.random() * MAP_WIDTH,
    y: Math.random() * MAP_HEIGHT,
  })),
  bushes: Array.from({ length: 100 }, () => ({
    x: Math.random() * MAP_WIDTH,
    y: Math.random() * MAP_HEIGHT,
  })),
  trees: Array.from({ length: 50 }, () => ({
    x: Math.random() * MAP_WIDTH,
    y: Math.random() * MAP_HEIGHT,
  })),
  rabbits: Array.from({ length: 80 }, () => ({
    x: Math.random() * MAP_WIDTH,
    y: Math.random() * MAP_HEIGHT,
    type: 'rabbit',
  })),
  wolves: Array.from({ length: 30 }, () => ({
    x: Math.random() * MAP_WIDTH,
    y: Math.random() * MAP_HEIGHT,
    type: 'wolf',
  })),
};

const Ecosystem = () => {
  const [populations, setPopulations] = useState(INITIAL_POPULATIONS);
  const [suggestionOptions, setSuggestionOptions] = useState([]);
  const [model, setModel] = useState(null);
  const [history, setHistory] = useState([
    { time: 0, ...INITIAL_POPULATIONS },
  ]);
  const [time, setTime] = useState(0);
  const [map, setMap] = useState(INITIAL_MAP);

  // Загружаем или создаем модель нейросети
  useEffect(() => {
    const loadModel = async () => {
      const newModel = tf.sequential();
      newModel.add(tf.layers.dense({ inputShape: [5], units: 20, activation: 'relu' }));
      newModel.add(tf.layers.dense({ units: 10, activation: 'relu' }));
      newModel.add(tf.layers.dense({ units: 5, activation: 'linear' }));
      newModel.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

      // Примерные данные для обучения (необходимо использовать реальные данные для лучшей модели)
      const xs = tf.tensor2d([
        [200, 100, 50, 80, 30],
        [210, 95, 55, 85, 25],
        [190, 105, 45, 75, 35],
        [205, 90, 60, 90, 20],
        [195, 110, 40, 70, 40],
      ]);
      const ys = tf.tensor2d([
        [205, 95, 55, 85, 25],
        [195, 105, 45, 75, 35],
        [200, 100, 50, 80, 30],
        [210, 90, 60, 90, 20],
        [190, 110, 40, 70, 40],
      ]);

      await newModel.fit(xs, ys, { epochs: 500 });
      setModel(newModel);
    };

    loadModel();
  }, []);

  // Обновление состояния экосистемы каждые 500 мс
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);

      setPopulations(prev => {
        const newPopulations = { ...prev };

        // Растения
        newPopulations.grass = Math.max(newPopulations.grass + getGrowthChange(newPopulations.grass), 0);
        newPopulations.bushes = Math.max(newPopulations.bushes + getGrowthChange(newPopulations.bushes), 0);
        newPopulations.trees = Math.max(newPopulations.trees + getGrowthChange(newPopulations.trees), 0);

        // Животные
        newPopulations.rabbits = Math.max(newPopulations.rabbits + getAnimalChange(newPopulations.rabbits, newPopulations.grass), 0);
        newPopulations.wolves = Math.max(newPopulations.wolves + getAnimalChange(newPopulations.wolves, newPopulations.rabbits), 0);

        return newPopulations;
      });

      // Обновление карты популяции
      setMap(prevMap => {
        const newMap = { ...prevMap };

        // Растения не двигаются

        // Перемещение животных
        newMap.rabbits = prevMap.rabbits.map(rabbit => ({
          ...rabbit,
          x: clamp(rabbit.x + getRandomMovement(), 0, MAP_WIDTH),
          y: clamp(rabbit.y + getRandomMovement(), 0, MAP_HEIGHT),
        }));

        newMap.wolves = prevMap.wolves.map(wolf => ({
          ...wolf,
          x: clamp(wolf.x + getRandomMovement(), 0, MAP_WIDTH),
          y: clamp(wolf.y + getRandomMovement(), 0, MAP_HEIGHT),
        }));

        return newMap;
      });

    }, 500); // Обновление каждые 500 мс

    return () => clearInterval(interval);
  }, []);

  // Функции для логики изменения популяций
  const getGrowthChange = (population) => {
    // Простая модель роста: больше популяции - медленнее рост
    if (population < 50) return 5;
    if (population < 150) return 3;
    if (population < 200) return 1;
    return 0;
  };

  const getAnimalChange = (population, foodSource) => {
    // Травоядные зависят от пищи (растений)
    if (population <= 0) return 0;

    if (foodSource < population * 2) {
      return -Math.floor(population * 0.1); // Недостаток пищи
    }

    return Math.floor(population * 0.05); // Рост популяции
  };

  // Функция для случайного движения на карте
  const getRandomMovement = () => {
    return Math.floor(Math.random() * 11) - 5; // От -5 до +5
  };

  // Функция для ограничения координат внутри карты
  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };

  // Обновление истории популяций
  useEffect(() => {
    setHistory(prevHistory => {
      const newHistory = [
        ...prevHistory,
        { time: time, ...populations },
      ];
      // Ограничиваем историю последними 100 записями
      if (newHistory.length > 100) {
        newHistory.shift();
      }
      return newHistory;
    });
  }, [populations, time]);

  // Запрос предложений от нейросети
  useEffect(() => {
    const getSuggestions = async () => {
      if (model) {
        const input = tf.tensor2d([[populations.grass, populations.bushes, populations.trees, populations.rabbits, populations.wolves]]);
        const output = model.predict(input);
        const suggestionValues = output.dataSync();
        const singleSuggestion = {
          grass: Math.round(suggestionValues[0]),
          bushes: Math.round(suggestionValues[1]),
          trees: Math.round(suggestionValues[2]),
          rabbits: Math.round(suggestionValues[3]),
          wolves: Math.round(suggestionValues[4]),
        };
        
        // Создадим несколько вариантов предложений (например, + и -)
        const options = [
          singleSuggestion,
          {
            grass: -singleSuggestion.grass,
            bushes: -singleSuggestion.bushes,
            trees: -singleSuggestion.trees,
            rabbits: -singleSuggestion.rabbits,
            wolves: -singleSuggestion.wolves,
          },
        ];
        
        setSuggestionOptions(options);
      }
    };

    getSuggestions();
  }, [populations, model]);

  // Обработчик действий пользователя
  const handleAction = (type, value) => {
    setPopulations(prev => ({
      ...prev,
      [type]: Math.max(prev[type] + value, 0),
    }));
  };

  // Обработчик применения предложений
  const handleApplySuggestion = (suggestion) => {
    setPopulations(prev => {
      const newPopulations = { ...prev };
      Object.keys(suggestion).forEach(species => {
        newPopulations[species] = Math.max(prev[species] + suggestion[species], 0);
      });
      return newPopulations;
    });
  };

  return (
    <div className="ecosystem-container">
      <div className="chart-and-controls">
        <PopulationChart history={history} />
        <div className="controls-suggestions">
          <Controls onAction={handleAction} />
          <Suggestions suggestions={suggestionOptions} onApply={handleApplySuggestion} />
        </div>
      </div>
      <PopulationMap map={map} />
      <div className="current-populations">
        <h3>Текущие Популяции:</h3>
        <p>Трава: {populations.grass}</p>
        <p>Кусты: {populations.bushes}</p>
        <p>Деревья: {populations.trees}</p>
        <p>Кролики: {populations.rabbits}</p>
        <p>Волки: {populations.wolves}</p>
      </div>
    </div>
  );
};

export default Ecosystem;