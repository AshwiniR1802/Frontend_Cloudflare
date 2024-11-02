import React, { useEffect, useState } from 'react';

// Helper function to format the timestamp
const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return new Date(date).toLocaleString('en-US', options);
};

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch unread notifications on component mount
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`https://notification-backend.aramanu01.workers.dev/api/get-notifications`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();

        // Sort notifications by most recent
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setNotifications(sortedData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    <div
      id="notification-feed"
      style={{
        height: '400px',
        overflowY: 'auto',
        padding: '10px',
        accessKey: 'F',
        border: '1px solid #D8BFD8', // Thistle border color
      }}
    >
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        notifications.map((notification, index) => (
          <div
            key={index}
            className="notification-card"
            style={{
              height: '70px',
              marginBottom: '10px',
              padding: '10px',
              backgroundColor:
                notification.type === 'alert'
                  ? '#ffcccb'
                  : notification.type === 'success'
                  ? '#90ee90'
                  : '#add8e6',
            }}
          >
            <p className="notification-message">{notification.message}</p>
            <div className="notification-timestamp">{formatDate(notification.timestamp)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationFeed;
