import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Notification from './Notification';
import { removeNotification } from "./slices/notificationSlice";
import { removeItem } from "./slices/cartSlice"; // Импортируйте removeItem
import { RootState } from "../store";
import { deleteCartItem } from "../Api"; // Импортируйте функцию deleteCartItem

const NotificationList = () => {
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const dispatch = useDispatch();

  const handleComplete = async (id: number, itemId: number) => {
    console.log("Removing notification with id:", id);
    dispatch(removeNotification(id));
    await deleteCartItem(itemId); // Удалите товар с сервера
    dispatch(removeItem(itemId)); // Удалите товар из состояния Redux
  };

  console.log("Current notifications:", notifications);

  return (
    <div className="notification-list">
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          item={notification.item}
          onCancel={() => dispatch(removeNotification(notification.id))}
          onComplete={(itemId) => handleComplete(notification.id, itemId)}
          index={index}
          operation={notification.operation}
        />
      ))}
    </div>
  );
};

export default NotificationList;
