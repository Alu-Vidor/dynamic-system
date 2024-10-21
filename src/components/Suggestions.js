// src/components/Suggestions.js
import React from 'react';
import './Suggestions.css'; // Убедитесь, что этот файл существует

const Suggestions = ({ suggestions, onApply }) => {
  if (!suggestions || suggestions.length === 0) return <div>Загрузка предложений нейросети...</div>;

  const renderSuggestion = (species, value) => {
    if (value > 0) {
      return `Добавить ${value}`;
    } else if (value < 0) {
      return `Удалить ${-value}`;
    } else {
      return 'Нет изменений';
    }
  };

  const handleApply = (suggestion) => {
    onApply(suggestion);
  };

  return (
    <div className="suggestions-container">
      <h2>Предложения Нейросети</h2>
      {suggestions.map((suggestion, index) => (
        <div key={index} className="suggestion-option">
          <ul>
            {Object.entries(suggestion).map(([species, value]) => (
              <li key={species}>
                {capitalize(species)}: {renderSuggestion(species, value)}
              </li>
            ))}
          </ul>
          <button onClick={() => handleApply(suggestion)}>Применить</button>
        </div>
      ))}
    </div>
  );
};

// Функция для капитализации первой буквы
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default Suggestions;