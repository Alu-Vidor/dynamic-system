// src/components/Controls.js
import React from 'react';
import './Controls.css'; // Убедитесь, что этот файл существует

const Controls = ({ onAction }) => {
  const species = [
    { name: 'grass', label: 'Трава', addValue: 20, removeValue: -20 },
    { name: 'bushes', label: 'Кусты', addValue: 10, removeValue: -10 },
    { name: 'trees', label: 'Деревья', addValue: 5, removeValue: -5 },
    { name: 'rabbits', label: 'Кролики', addValue: 15, removeValue: -15 },
    { name: 'wolves', label: 'Волки', addValue: 5, removeValue: -5 },
  ];

  return (
    <div className="controls-container">
      <h2>Управление Экосистемой</h2>
      {species.map(species => (
        <div key={species.name} className="control-group">
          <h3>{species.label}</h3>
          <button onClick={() => onAction(species.name, species.addValue)}>Добавить</button>
          <button onClick={() => onAction(species.name, species.removeValue)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default Controls;