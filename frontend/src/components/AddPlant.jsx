import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlant } from '../services/api';
import './AddPlant.css';

const AddPlant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    purchaseDate: '',
    waterQuantity: '',
    waterFrequency: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPlant(formData);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la plante:', error);
      alert('Erreur lors de l\'ajout de la plante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-plant">
      <div className="form-container">
        <h1>Ajouter une Nouvelle Plante</h1>
        
        <form onSubmit={handleSubmit} className="plant-form">
          <div className="form-group">
            <label htmlFor="name">Nom de la plante *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Mon Monstera"
            />
          </div>

          <div className="form-group">
            <label htmlFor="species">Espèce *</label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
              placeholder="Ex: Monstera Deliciosa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="purchaseDate">Date d'achat *</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="waterQuantity">Quantité d'eau (litres) *</label>
              <input
                type="number"
                id="waterQuantity"
                name="waterQuantity"
                value={formData.waterQuantity}
                onChange={handleChange}
                required
                min="0.1"
                step="0.1"
                placeholder="Ex: 0.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="waterFrequency">Fréquence (jours) *</label>
              <input
                type="number"
                id="waterFrequency"
                name="waterFrequency"
                value={formData.waterFrequency}
                onChange={handleChange}
                required
                min="1"
                placeholder="Ex: 3"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Photo de la plante</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="file-input"
            />
            <div className="file-input-help">
              Formats acceptés: JPG, PNG, GIF (max 5MB)
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="cancel-button"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter la plante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlant;