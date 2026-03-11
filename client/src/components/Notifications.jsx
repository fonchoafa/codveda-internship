import { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const Notifications = () => {
  const { notifications = [] } = useSocket();
  const [show, setShow] = useState(false);

  return (
    <div className="notifications-wrapper">
      <button
        className="notif-btn"
        onClick={() => setShow(!show)}
      >
        🔔 {notifications.length > 0 && (
          <span className="notif-count">{notifications.length}</span>
        )}
      </button>

      {show && (
        <div className="notifications-dropdown">
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <p className="no-notif">No notifications yet</p>
          ) : (
            notifications.map((notif, i) => (
              <div key={i} className={`notif-item ${notif.type}`}>
                <p>{notif.message}</p>
                <span>{new Date(notif.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;