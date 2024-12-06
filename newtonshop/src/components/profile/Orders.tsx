import React from "react";
import { Link } from "react-router-dom";
import { categoryMapping } from "../categoryMapping";
import { OrderResponseDto } from "../../types";

interface OrdersProps {
  orders: OrderResponseDto[];
  expandedOrderId: number | null;
  toggleOrderDetails: (orderId: number) => void;
  formatCardNumber: (cardNumber: string) => string;
}

const Orders = ({ orders, expandedOrderId, toggleOrderDetails, formatCardNumber }: OrdersProps) => {
  return (
    <>
      <h3 className="orders-title">Ваши заказы</h3>
      <div className="orders-container">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className={`order-header ${expandedOrderId === order.id ? "expanded" : ""}`}>
                <span>
                  Заказ №{order.id} от {order.creationDate}
                </span>
                <span className="order-status">в пути</span>
                <img
                  alt="Arrow"
                  className={`arrow-down ${expandedOrderId === order.id ? "expanded" : ""}`}
                  onClick={() => toggleOrderDetails(order.id)}
                  src="/image/svg/arrow.svg"
                />
              </div>
              {expandedOrderId !== order.id && (
                <div className="order-details">
                  <div className="order-images">
                    {order.cartItems.map((item, index) => (
                      <img
                        key={index}
                        src={item.imageUrl ? item.imageUrl : "/image/placeholder.svg"}
                        alt={`Изображение товара ${index + 1}`}
                        className="order-image"
                      />
                    ))}
                  </div>
                  <div className="order-price">
                    <span className="total-price">${order.totalPrice}</span>
                  </div>
                </div>
              )}
              {expandedOrderId === order.id && (
                <div className="order-details-expanded">
                  <p>ФИО: {order.fullName}</p>
                  <p>Email: {order.email}</p>
                  <p>Телефон: {order.phoneNumber}</p>
                  <p>Адрес: {order.address}</p>
                  <p className={`card-number ${expandedOrderId === order.id ? "expanded" : ""}`}>
                    Номер карты: {formatCardNumber(order.cardNumber)}
                  </p>
                  {order.cartItems.length > 0 ? (
                    order.cartItems.map((item) => (
                      <div key={item.id} className="order-item-product">
                        <Link
                          to={`/${categoryMapping[item.type.slice(0, 3)]}/${item.productId}`}
                          className="product-link"
                        >
                          <img
                            src={item.imageUrl ? item.imageUrl : "/image/placeholder.svg"}
                            alt={"Изображение товара"}
                            className="order-image"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/${categoryMapping[item.type.slice(0, 3)]}/${item.productId}`}
                            className="product-link"
                          >
                            <p>{item.name}</p>
                          </Link>
                          <p>Количество: {item.quantity}</p>
                          <p>
                            {item.config.split(",").map((config, index) => (
                              <span key={index}>
                                {config}
                                <br />
                              </span>
                            ))}
                          </p>
                        </div>
                        <p className="price-product">${item.price}</p>
                      </div>
                    ))
                  ) : (
                    <p>Нет товаров</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-orders">У вас пока нет заказов</div>
        )}
      </div>
    </>
  );
};

export default Orders;
