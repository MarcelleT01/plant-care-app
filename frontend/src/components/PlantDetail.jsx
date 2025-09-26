import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlant, waterPlant, getWateringHistory } from '../services/api';
import './PlantDetail.css';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWaterForm, setShowWaterForm] = useState(false);
  const [wateringData, setWateringData] = useState({
    quantityGiven: '',
    notes: ''
  });

  useEffect(() => {
    fetchPlantData();
  }, [id]);

  const fetchPlantData = async () => {
    try {
      const [plantData, historyData] = await Promise.all([
        getPlant(id),
        getWateringHistory(id)
      ]);
      setPlant(plantData);
      setHistory(historyData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatering = async (e) => {
    e.preventDefault();
    try {
      await waterPlant(id, wateringData);
      setShowWaterForm(false);
      setWateringData({ quantityGiven: '', notes: '' });
            // Actualiser les données
      fetchPlantData();
    } catch (error) {
      console.error('Erreur lors de l\'arrosage:', error);
      alert('Erreur lors de l\'enregistrement de l\'arrosage');
    }
  };

  const getWateringStatus = () => {
    if (!plant?.nextWateringDate) return 'no-date';
    
    const today = new Date();
    const nextWatering = new Date(plant.nextWateringDate);
    
    if (nextWatering <= today) return 'needs-water';
    
    const daysUntilWatering = Math.ceil((nextWatering - today) / (1000 * 60 * 60 * 24));
    if (daysUntilWatering <= 1) return 'water-soon';
    
    return 'water-ok';
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!plant) {
    return <div className="error">Plante non trouvée</div>;
  }

  return (
    <div className="plant-detail">
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Retour
        </button>
        <h1>{plant.name}</h1>
      </div>

      <div className="plant-info-section">
        <div className="plant-image-large">
          {plant.image ? (
            <img 
              src={`http://localhost:5000/${plant.image}`} 
              alt={plant.name}
            />
          ) : (
            <div className="placeholder-image-large"></div>
          )}
        </div>

        <div className="plant-details">
          <div className="detail-item">
            <h3>Espèce</h3>
            <p>{plant.species}</p>
          </div>

          <div className="detail-item">
            <h3>Date d'achat</h3>
            <p>{new Date(plant.purchaseDate).toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="detail-item">
            <h3>Besoins en eau</h3>
            <p>{plant.wateringNeeds.quantity}L tous les {plant.wateringNeeds.frequency} jour{plant.wateringNeeds.frequency > 1 ? 's' : ''}</p>
          </div>

          <div className="detail-item">
            <h3>Statut d'arrosage</h3>
            <div className={`status-badge ${getWateringStatus()}`}>
              {getWateringStatus() === 'needs-water' && ' À arroser maintenant'}
              {getWateringStatus() === 'water-soon' && ' À arroser bientôt'}
              {getWateringStatus() === 'water-ok' && ' Arrosage à jour'}
              {getWateringStatus() === 'no-date' && ' Pas encore arrosée'}
            </div>
          </div>

          {plant.lastWatered && (
            <div className="detail-item">
              <h3>Dernier arrosage</h3>
              <p>{new Date(plant.lastWatered).toLocaleDateString('fr-FR')}</p>
            </div>
          )}

          {plant.nextWateringDate && (
            <div className="detail-item">
              <h3>Prochain arrosage</h3>
              <p>{new Date(plant.nextWateringDate).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="actions-section">
        <button 
          onClick={() => setShowWaterForm(true)}
          className="water-button"
        >
          Arroser cette plante
        </button>
      </div>

      {showWaterForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enregistrer l'arrosage</h3>
            <form onSubmit={handleWatering}>
              <div className="form-group">
                <label>Quantité donnée (litres)</label>
                <input
                  type="number"
                  value={wateringData.quantityGiven}
                  onChange={(e) => setWateringData({
                    ...wateringData,
                    quantityGiven: e.target.value
                  })}
                  min="0.1"
                  step="0.1"
                  required
                  placeholder={`Recommandé: ${plant.wateringNeeds.quantity}L`}
                />
              </div>

              <div className="form-group">
                <label>Notes (optionnel)</label>
                <textarea
                  value={wateringData.notes}
                  onChange={(e) => setWateringData({
                    ...wateringData,
                    notes: e.target.value
                  })}
                  placeholder="État de la plante, observations..."
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowWaterForm(false)}
                  className="cancel-button"
                >
                  Annuler
                </button>
                <button type="submit" className="confirm-button">
                  Confirmer l'arrosage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="history-section">
        <h2>Historique d'arrosage</h2>
        {history.length === 0 ? (
          <p className="no-history">Aucun arrosage enregistré pour cette plante</p>
        ) : (
          <div className="history-list">
            {history.map(entry => (
              <div key={entry._id} className="history-item">
                <div className="history-date">
                  {new Date(entry.wateringDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="history-quantity">
                  {entry.quantityGiven}L
                </div>
                {entry.notes && (
                  <div className="history-notes">
                    {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetail;