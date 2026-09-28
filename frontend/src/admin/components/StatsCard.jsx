import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatsCard = ({ title, value, icon, color, change, onClick }) => {
  return (
    <div
      className="admin-stat-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      <div
        className="admin-stat-icon"
        style={color ? { background: `${color}15`, color } : undefined}
      >
        <FontAwesomeIcon icon={icon} />
      </div>

      <div className="admin-stat-value">{value}</div>

      <div className="admin-stat-label">
        <span className="admin-stat-name">{title}</span>
        {change && (
          <span
            className={`admin-stat-delta ${
              String(change).startsWith('+') ? 'positive' : 'negative'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
