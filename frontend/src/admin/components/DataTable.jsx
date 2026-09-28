import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const DataTable = ({ columns, data, onEdit, onDelete, onView, actions = true }) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="actions-cell">
                  {onView && (
                    <button onClick={() => onView(row)} className="action-btn view">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="action-btn edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="action-btn delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .data-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th,
        .data-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .data-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        
        .data-table tr:hover {
          background: #f9fafb;
        }
        
        .actions-cell {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        
        .action-btn.view { color: #3b82f6; }
        .action-btn.edit { color: #f59e0b; }
        .action-btn.delete { color: #ef4444; }
        
        .action-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default DataTable;