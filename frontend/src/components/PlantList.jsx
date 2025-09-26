import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlants } from '../services/api';
import './PlantList.css';

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const plantsData = await getPlants();
      setPlants(plantsData);
    } catch (error) {
      console.error('Erreur lors du chargement des plantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWateringStatus = (plant) => {
    if (!plant.nextWateringDate) return 'no-date';
    
    const today = new Date();
    const nextWatering = new Date(plant.nextWateringDate);
    
    if (nextWatering <= today) return 'needs-water';
    
    const daysUntilWatering = Math.ceil((nextWatering - today) / (1000 * 60 * 60 * 24));
    if (daysUntilWatering <= 1) return 'water-soon';
    
    return 'water-ok';
  };

  const getStatusText = (plant) => {
    const status = getWateringStatus(plant);
    switch (status) {
      case 'needs-water':
        return 'À arroser maintenant';
      case 'water-soon':
        return 'À arroser bientôt';
      case 'water-ok':
        const days = Math.ceil((new Date(plant.nextWateringDate) - new Date()) / (1000 * 60 * 60 * 24));
        return `Arrosage dans ${days} jour${days > 1 ? 's' : ''}`;
      default:
        return 'Pas de programmation';
    }
  };

  if (loading) {
    return <div className="loading">Chargement des plantes...</div>;
  }

  return (
    <div className="plant-list">
      <div className="list-header">
        <h1>Mes Plantes d'Intérieur</h1>
        <Link to="/add" className="add-button">
          + Ajouter une plante
        </Link>
      </div>

      {plants.length === 0 ? (
        <div className="empty-state">
          <h3>Aucune plante ajoutée</h3>
          <p>Commencez par ajouter votre première plante !</p>
          <Link to="/add" className="cta-button">Ajouter ma première plante</Link>
        </div>
      ) : (
        <div className="plants-grid">
          {plants.map(plant => (
            <div key={plant._id} className={`plant-card ${getWateringStatus(plant)}`}>
              <Link to={`/plant/${plant._id}`} className="plant-link">
                <div className="plant-image">
                  {plant.image ? (
                    <img 
                      src={`http://localhost:5000/${plant.image}`} 
                      alt={plant.name}
                    />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                </div>
                
                <div className="plant-info">
                  <h3>{plant.name}</h3>
                  <p className="species">{plant.species}</p>
                  
                  <div className="watering-info">
                    <div className="water-needs">
                      <span className="quantity">{plant.wateringNeeds.quantity}L</span>
                      <span className="frequency">tous les {plant.wateringNeeds.frequency} jour{plant.wateringNeeds.frequency > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className={`status ${getWateringStatus(plant)}`}>
                      {getStatusText(plant)}
                    </div>
                  </div>
                  
                  {plant.lastWatered && (
                    <div className="last-watered">
                      Dernier arrosage: {new Date(plant.lastWatered).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantList;