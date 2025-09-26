import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../services/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(notif => notif._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return <div className="loading">Chargement des notifications...</div>;
  }

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <div className="unread-count">
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <h3>Aucune notification</h3>
          <p>Vous êtes à jour avec vos plantes ! </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <div className="notification-icon">
                  {notification.type === 'watering' ? '' : ''}
                </div>
                
                <div className="notification-details">
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  
                  <div className="notification-meta">
                    <span className="notification-date">
                      {new Date(notification.createdAt).toLocaleString('fr-FR')}
                    </span>
                    
                    {notification.plantId?.image && (
                      <img 
                        src={`http://localhost:5000/${notification.plantId.image}`}
                        alt={notification.plantId.name}
                        className="notification-plant-image"
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="notification-actions">
                {!notification.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="mark-read-button"
                    title="Marquer comme lu"
                  >
                    ✓
                  </button>
                )}
                
                <button 
                  onClick={() => handleDelete(notification._id)}
                  className="delete-button"
                  title="Supprimer"
                >
                  
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;