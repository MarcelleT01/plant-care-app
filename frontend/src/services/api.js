const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Plants API
export const getPlants = async () => {
  const response = await fetch(`${API_BASE_URL}/plants`);
  return response.json();
};

export const getPlant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/plants/${id}`);
  return response.json();
};

export const createPlant = async (plantData) => {
  const formData = new FormData();
  Object.keys(plantData).forEach(key => {
    formData.append(key, plantData[key]);
  });

  const response = await fetch(`${API_BASE_URL}/plants`, {
    method: 'POST',
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
    body: formData,
  });
  return response.json();
};

export const deletePlant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

// Watering API
export const waterPlant = async (plantId, wateringData) => {
  const response = await fetch(`${API_BASE_URL}/watering/${plantId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wateringData),
  });
  return response.json();
};

export const getWateringHistory = async (plantId) => {
  const response = await fetch(`${API_BASE_URL}/watering/${plantId}/history`);
  return response.json();
};

export const getAllWateringHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/watering/history/all`);
  return response.json();
};

// Notifications API
export const getNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications`);
  return response.json();
};

export const checkWateringNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications/check-watering`);
  return { data: await response.json() };
};

export const markNotificationAsRead = async (id) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PUT',
  });
  return response.json();
};

export const deleteNotification = async (id) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};