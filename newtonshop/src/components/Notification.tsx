import React, { useEffect, useState } from "react";
import { CartItemDto, CartItemRequestDto } from "../types";
import "./Notification.css";

interface NotificationProps {
  item: CartItemDto | CartItemRequestDto;
  onCancel: () => void;
  onComplete: () => void;
  index: number;
  operation: "add" | "remove";
}

const Notification = ({ item, onCancel, onComplete, index, operation }: NotificationProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 75);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  const isCartItemDto = (item: CartItemDto | CartItemRequestDto): item is CartItemDto => {
    return (item as CartItemDto).name !== undefined;
  };

  return (
    <div className="notification-container" style={{ bottom: `${index * 120 + 20}px` }}>
      <div className="notification-content">
        <div className="notification-progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="notification-item-details">
          <img
            src={item.imageUrl ? item.imageUrl : "/image/placeholder.svg"}
            alt={isCartItemDto(item) ? item.name : ""}
          />
          <div className="notification-item-info">
            <h3>{isCartItemDto(item) ? item.name : ""}</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="notification-operation">
                {operation === "add" ? "Добавлено в корзину" : "Удаление из корзины"}
              </span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span className="notification-item-price">
                  ${(item.price * (isCartItemDto(item) ? item.quantity : 1)).toFixed(2)}
                </span>
                {operation === "remove" && (
                  <button className="notification-cancel-button" onClick={onCancel}>
                    Отменить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
