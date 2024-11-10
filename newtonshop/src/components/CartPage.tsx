import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { getCurrentProfile } from "../Api";

const CartPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", price: 52000, quantity: 1, config: "Config 1" },
    { id: 2, name: "Item 2", price: 52000, quantity: 1, config: "Config 2" },
    { id: 3, name: "Item 3", price: 52000, quantity: 1, config: "Config 3" },
  ]);

  const [customerData, setCustomerData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Начинаем с шага 1

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const data = await getCurrentProfile();
          setCustomerData({
            fullName: data.fullName,
            phone: data.phoneNumber,
            email: data.email,
          });
          setCurrentStep(2); // Переходим на шаг 2 после загрузки данных
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData({ ...customerData, [field]: value });
    if (Object.values(customerData).every(value => value) && Object.values(customerData).length === 3) {
      setCurrentStep(2);
    }
  };

  const handleDeliveryInfoChange = (value: string) => {
    setDeliveryInfo(value);
    if (value) {
      setCurrentStep(3);
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    const formattedValue = formatCardNumber(value);
    if (formattedValue.length <= 19) {
      setPaymentMethod(formattedValue);
    }
    if (formattedValue.length === 19) {
      setCurrentStep(4);
    }
  };
  const DottedLine = () => (
    <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
      <line x1="0" y1="1" x2="100" y2="1" stroke="#514ed9" strokeWidth="2" strokeDasharray="5,5" />
    </svg>
  );

  const formatCardNumber = (value: string) => {
    // Удаляем все символы, кроме цифр
    const cleanedValue = value.replace(/\D/g, "");
    // Форматируем номер карты
    const match = cleanedValue.match(/.{1,4}/g);
    return (match ? match.join("-") : "");
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-items">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="cart-item">
              <img src={`path_to_image_${item.id}.jpg`} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>
                <p>{item.config}</p>
                <span>{item.price * item.quantity} ₽</span>
                <button onClick={() => handleRemoveItem(item.id)} className="remove-button">
                  <img src="removeIcon.png" alt="Remove" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart">Ваша корзина пуста</div>
        )}
      </div>
      <div className="customer-info">
        <div className="step-circle">{currentStep >= 1 ? 1 : ""}</div>
        <div className="step-text">Данные покупателя</div>
        <input
          type="text"
          placeholder="ФИО"
          value={customerData.fullName}
          onChange={(e) => handleCustomerDataChange("fullName", e.target.value)}
          readOnly
        />
        <input
          type="text"
          placeholder="Номер телефона"
          value={customerData.phone}
          onChange={(e) => handleCustomerDataChange("phone", e.target.value)}
          readOnly
        />
        <input
          type="email"
          placeholder="Email"
          value={customerData.email}
          onChange={(e) => handleCustomerDataChange("email", e.target.value)}
          readOnly
        />
        {currentStep >= 2 && <DottedLine />}
        {currentStep >= 2 && (
          <>
            <div className="step-circle">{currentStep >= 2 ? 2 : ""}</div>
            <div className="step-text">Место получения товара</div>
            <input
              type="text"
              placeholder="Укажите адрес доставки"
              value={deliveryInfo}
              onChange={(e) => handleDeliveryInfoChange(e.target.value)}
            />
            {currentStep >= 3 && <DottedLine />}
          </>
        )}
        {currentStep >= 3 && (
          <>
            <div className="step-circle">{currentStep >= 3 ? 3 : ""}</div>
            <div className="step-text">Способ оплаты</div>
            <input
              type="text"
              placeholder="Номер карты"
              value={paymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
            />
            {currentStep >= 4 && <DottedLine />}
          </>
        )}
        {currentStep >= 4 && (
          <>
            <div className="step-circle">{currentStep >= 4 ? 4 : ""}</div>
            <div className="step-text">Подтверждение товара</div>
          </>
        )}
        <div className="total-price">Итоговая цена: {totalPrice} ₽</div>
        <button className="order-button">Оформить заказ</button>
      </div>
    </div>
  );
};

export default CartPage;
