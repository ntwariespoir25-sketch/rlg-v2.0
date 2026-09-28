import React from 'react';

const ChartCard = ({ title, children }) => {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div className="chart-content">
        {children}
      </div>

      <style>{`
        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .chart-card h3 {
          margin-bottom: 15px;
          color: #374151;
          font-size: 16px;
        }
        
        .chart-content {
          min-height: 300px;
        }
      `}</style>
    </div>
  );
};

export default ChartCard;