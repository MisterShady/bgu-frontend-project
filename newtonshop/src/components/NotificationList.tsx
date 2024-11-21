import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Notification from './Notification';
import { removeNotification } from "./slices/notificationSlice";
import { RootState } from "../store";

const NotificationList = () => {
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const dispatch = useDispatch();

  const handleComplete = async (id: number) => {
    dispatch(removeNotification(id));
  };

  console.log("Current notifications:", notifications);

  return (
      <div className="notification-list">
        {notifications.map((notification, index) => (
            <Notification
                key={notification.id}
                item={notification.item}
                onCancel={() => dispatch(removeNotification(notification.id))}
                onComplete={() => handleComplete(notification.id)}
                index={index}
                operation={notification.operation}
            />
        ))}
      </div>
  );
};

export default NotificationList;
