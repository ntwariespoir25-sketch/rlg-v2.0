import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatsCard = ({ title, value, icon, color, change }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ background: `${color}15`, color }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="stats-info">
        <h3>{value}</h3>
        <p>{title}</p>
        {change && <span className={`stats-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>{change}</span>}
      </div>

      <style>{`
        .stats-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .stats-card:hover {
          transform: translateY(-3px);
        }
        
        .stats-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .stats-info h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .stats-info p {
          color: #6b7280;
          font-size: 14px;
        }
        
        .stats-change {
          font-size: 12px;
          font-weight: 600;
        }
        
        .stats-change.positive {
          color: #22c55e;
        }
        
        .stats-change.negative {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default StatsCard;