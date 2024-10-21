// src/components/PopulationMap.js
import React from 'react';
import './PopulationMap.css';

// SVG иконки для видов
const icons = {
  grass: (
    <svg width="10" height="10" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="green" />
    </svg>
  ),
  bushes: (
    <svg width="10" height="10" viewBox="0 0 64 64">
      <ellipse cx="32" cy="32" rx="25" ry="15" fill="brown" />
    </svg>
  ),
  trees: (
    <svg width="12" height="12" viewBox="0 0 64 64">
      <polygon points="32,5 45,30 19,30" fill="darkgreen" />
      <rect x="28" y="30" width="8" height="20" fill="sienna" />
    </svg>
  ),
  rabbit: (
    <svg width="12" height="12" viewBox="0 0 64 64">
      <circle cx="32" cy="24" r="10" fill="gray" />
      <ellipse cx="27" cy="18" rx="3" ry="6" fill="gray" />
      <ellipse cx="37" cy="18" rx="3" ry="6" fill="gray" />
    </svg>
  ),
  wolf: (
    <svg width="14" height="14" viewBox="0 0 64 64">
      <polygon points="32,5 52,22 32,39 12,22" fill="red" />
      <circle cx="32" cy="22" r="5" fill="black" />
    </svg>
  ),
};

const PopulationMap = ({ map }) => {
  return (
    <div className="population-map">
      <h2>Карта Популяции</h2>
      <svg width="800" height="500" className="map-svg">
        {/* Растения */}
        {map.grass.map((plant, index) => (
          <g key={`grass-${index}`} className="plant">
            {icons.grass}
            <circle cx={plant.x} cy={plant.y} r="3" fill="green" />
          </g>
        ))}
        {map.bushes.map((bush, index) => (
          <g key={`bushes-${index}`} className="bush">
            {icons.bushes}
            <ellipse cx={bush.x} cy={bush.y} rx="5" ry="3" fill="brown" />
          </g>
        ))}
        {map.trees.map((tree, index) => (
          <g key={`trees-${index}`} className="tree">
            {icons.trees}
            <polygon points={`${tree.x},${tree.y - 15} ${tree.x + 10},${tree.y} ${tree.x - 10},${tree.y}`} fill="darkgreen" />
            <rect x={tree.x - 2} y={tree.y} width="4" height="10" fill="sienna" />
          </g>
        ))}

        {/* Животные */}
        {map.rabbits.map((rabbit, index) => (
          <g key={`rabbit-${index}`} className="animal rabbit">
            {icons.rabbit}
            <circle cx={rabbit.x} cy={rabbit.y} r="5" fill="gray" />
            <ellipse cx={rabbit.x - 3} cy={rabbit.y - 6} rx="1" ry="3" fill="gray" />
            <ellipse cx={rabbit.x + 3} cy={rabbit.y - 6} rx="1" ry="3" fill="gray" />
          </g>
        ))}
        {map.wolves.map((wolf, index) => (
          <g key={`wolf-${index}`} className="animal wolf">
            {icons.wolf}
            <polygon points={`${wolf.x},${wolf.y - 10} ${wolf.x + 10},${wolf.y} ${wolf.x},${wolf.y + 10} ${wolf.x - 10},${wolf.y}`} fill="red" />
            <circle cx={wolf.x} cy={wolf.y} r="3" fill="black" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default PopulationMap;