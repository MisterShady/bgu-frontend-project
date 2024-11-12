import React, { useEffect, useState } from "react";
import { getCartItems, updateCartItem, deleteCartItem, getCurrentProfile } from "../Api";
import { CartItemDto } from "../types";
import "./CartPage.css";

const CartPage = () => {
  const [items, setItems] = useState<CartItemDto[]>([]);
  const [customerData, setCustomerData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

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
          setCurrentStep(2);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const cartItems = await getCartItems();
        setItems(cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchUserData();
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      const updatedItem = await updateCartItem(id, quantity, true);
      setItems(items.map((item) => (item.id === id ? updatedItem : item)));
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await deleteCartItem(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData({ ...customerData, [field]: value });
    if (Object.values(customerData).every((value) => value) && Object.values(customerData).length === 3) {
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
    const cleanedValue = value.replace(/\D/g, "");
    const match = cleanedValue.match(/.{1,4}/g);
    return match ? match.join("-") : "";
  };

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-items">
        {items.length > 0 ? (
          items.map((item: CartItemDto) => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <div className="quantity-container">
                  <button
                    className="quantity-button left"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="quantity-button right"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="config-items">
                  {item.config.split(",").map((configItem: string, index: number) => (
                    <p key={index}>{configItem.trim()}</p>
                  ))}
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => handleRemoveItem(item.id)} className="remove-button">
                  <img src="/image/device/trash.svg" alt="Remove" />
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
        />
        <input
          type="text"
          placeholder="Номер телефона"
          value={customerData.phone}
          onChange={(e) => handleCustomerDataChange("phone", e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={customerData.email}
          onChange={(e) => handleCustomerDataChange("email", e.target.value)}
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
        <div className="total-price">Итоговая цена: {totalPrice.toFixed(2)} $</div>
        <button className="order-button">Оформить заказ</button>
      </div>
    </div>
  );
};

export default CartPage;
