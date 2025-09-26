import React, { useState, useEffect } from 'react';
import { getAllWateringHistory } from '../services/api';
import './WateringHistory.css';

const WateringHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const historyData = await getAllWateringHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredHistory = () => {
    if (filter === 'all') return history;
    
    const days = parseInt(filter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return history.filter(entry => 
      new Date(entry.wateringDate) >= cutoffDate
    );
  };

  const groupByDate = (entries) => {
    const grouped = {};
    entries.forEach(entry => {
      const date = new Date(entry.wateringDate).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    return grouped;
  };

  if (loading) {
    return <div className="loading">Chargement de l'historique...</div>;
  }

  const filteredHistory = getFilteredHistory();
  const groupedHistory = groupByDate(filteredHistory);

  return (
    <div className="watering-history">
      <div className="history-header">
        <h1>Historique d'Arrosage</h1>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tout l'historique</option>
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="empty-history">
          <h3>Aucun arrosage enregistré</h3>
          <p>Commencez par arroser vos plantes pour voir l'historique ici !</p>
        </div>
      ) : (
        <div className="history-timeline">
          {Object.keys(groupedHistory)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(dateString => (
              <div key={dateString} className="history-day">
                <div className="day-header">
                  <h3>{new Date(dateString).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</h3>
                </div>
                
                <div className="day-entries">
                  {groupedHistory[dateString].map(entry => (
                    <div key={entry._id} className="history-entry">
                      <div className="plant-info">
                        {entry.plantId.image && (
                          <img 
                            src={`http://localhost:5000/${entry.plantId.image}`}
                            alt={entry.plantId.name}
                            className="plant-thumbnail"
                          />
                        )}
                        <div className="plant-details">
                          <h4>{entry.plantId.name}</h4>
                          <p>{entry.plantId.species}</p>
                        </div>
                      </div>
                      
                      <div className="watering-details">
                        <div className="quantity">
                          <span className="value">{entry.quantityGiven}L</span>
                          <span className="label">d'eau</span>
                        </div>
                        <div className="time">
                          {new Date(entry.wateringDate).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      {entry.notes && (
                        <div className="entry-notes">
                          <p>{entry.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WateringHistory;