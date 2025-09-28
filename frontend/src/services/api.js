const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fonction pour obtenir les headers avec le token d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fonction pour obtenir les headers pour les uploads avec le token d'authentification
const getAuthHeadersForUpload = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Plants API
export const getPlants = async () => {
  const response = await fetch(`${API_BASE_URL}/plants`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const getPlant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const createPlant = async (plantData) => {
  const formData = new FormData();
  Object.keys(plantData).forEach(key => {
    formData.append(key, plantData[key]);
  });

  const response = await fetch(`${API_BASE_URL}/plants`, {
    method: 'POST',
    headers: getAuthHeadersForUpload(),
    body: formData,
  });
  return response.json();
};

export const updatePlant = async (id, plantData) => {
  const formData = new FormData();
  Object.keys(plantData).forEach(key => {
    formData.append(key, plantData[key]);
  });

  const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
    method: 'PUT',
    headers: getAuthHeadersForUpload(),
    body: formData,
  });
  return response.json();
};

export const deletePlant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return response.json();
};

// Watering API
export const waterPlant = async (plantId, wateringData) => {
  const response = await fetch(`${API_BASE_URL}/watering/${plantId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(wateringData),
  });
  return response.json();
};

export const getWateringHistory = async (plantId) => {
  const response = await fetch(`${API_BASE_URL}/watering/${plantId}/history`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const getAllWateringHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/watering/history/all`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

// Notifications API
export const getNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const checkWateringNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications/check-watering`, {
    headers: getAuthHeaders()
  });
  return { data: await response.json() };
};

export const markNotificationAsRead = async (id) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  return response.json();
};

export const deleteNotification = async (id) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return response.json();
};