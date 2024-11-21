import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  getCartItems,
  getCurrentProfile,
  selectAllCartItems,
  setAllToUnselected,
  updateCartItem,
} from "../Api";
import { CartItemDto, OrderRequestDto } from "../types";
import Notification from "./Notification";
import "./CartPage.css";
import "./Notification.css";
import { Link } from "react-router-dom";
import { categoryMapping } from "./products/AllProducts";
import {
  setCurrentStep,
  setCustomerData,
  setDeliveryInfo,
  setItems,
  setPaymentMethod,
  updateItem,
  setRemovalQueue,
  clearRemovalQueue,
  setCurrentRemovalIndex,
  removeItem,
} from "./slices/cartSlice";
import { RootState } from "../store";
import { addNotification } from "./slices/notificationSlice";
import { deleteAllSelectedCartItems, deleteAllCartItems } from "../Api";
import { deleteCartItem } from "../Api";

const CartPage = () => {
  const dispatch = useDispatch();
  const {
    items,
    customerData,
    deliveryInfo,
    paymentMethod,
    currentStep,
    removalQueue,
    currentRemovalIndex,
  } = useSelector(
    (state: RootState) => state.cart,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const data = await getCurrentProfile();
        dispatch(setCustomerData({
          fullName: data.fullName,
          phone: data.phoneNumber,
          email: data.email,
        }));
        dispatch(setCurrentStep(2));
      }
    };

    const fetchCartItems = async () => {
      const cartItems = await getCartItems();
      dispatch(setItems(cartItems));
    };

    fetchUserData();
    fetchCartItems();
  }, [dispatch]);

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    const item = items.find((item) => item.id === id);
    if (item) {
      const updatedItem = await updateCartItem(id, quantity, item.selected);
      dispatch(updateItem(updatedItem));
    }
  };

  const handleSelectedChange = async (id: number, selected: boolean) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const updatedItem = await updateCartItem(id, item.quantity, selected);
      dispatch(updateItem(updatedItem));
    }
  };

  const handleNotificationCancel = () => {
    dispatch(clearRemovalQueue());
  };

  const handleRemoveItem = async (id: number) => {
    await deleteCartItem(id);
    dispatch(removeItem(id));
  };

  const handleNotificationComplete = async () => {
    const queue = [...removalQueue];
    if (queue.length === items.length) {
      await deleteAllCartItems();
      dispatch(setItems([]));
    } else {
      await deleteAllSelectedCartItems();
      dispatch(setItems(items.filter(item => !queue.some(queueItem => queueItem.id === item.id))));
    }
    dispatch(clearRemovalQueue());
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    dispatch(setCustomerData({ ...customerData, [field]: value }));
    if (Object.values(customerData).every((value) => value) && Object.values(customerData).length === 3) {
      dispatch(setCurrentStep(2));
    }
  };

  const handleDeliveryInfoChange = (value: string) => {
    dispatch(setDeliveryInfo(value));
    if (value) {
      dispatch(setCurrentStep(3));
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    const formattedValue = formatCardNumber(value);
    if (formattedValue.length <= 19) {
      dispatch(setPaymentMethod(formattedValue));
    }
    if (formattedValue.length === 19) {
      dispatch(setCurrentStep(3));
    }
  };

  const handleSelectAll = async () => {
    const allSelected = items.every(item => item.selected);
    if (allSelected) {
      const updatedItems = await setAllToUnselected();
      dispatch(setItems(updatedItems));
    } else {
      const updatedItems = await selectAllCartItems();
      dispatch(setItems(updatedItems));
    }
  };

  const handleDeleteAllSelected = async () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("Пожалуйста, выберите товары для удаления.");
      return;
    }

    dispatch(setRemovalQueue(selectedItems));
    dispatch(setCurrentRemovalIndex(0));
  };

  const handleDeleteAll = async () => {
    if (items.length === 0) {
      alert("Нет товаров в корзине :(");
      return;
    }

    dispatch(setRemovalQueue(items));
    dispatch(setCurrentRemovalIndex(0));
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

  const totalPrice = items.reduce((total, item) => (item.selected ? total + item.price * item.quantity : total), 0);

  const handleOrderSubmit = async () => {
    const selectedItems = items.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert("Пожалуйста, выберите товары для оформления заказа.");
      return;
    }

    const orderData: OrderRequestDto = {
      fullName: customerData.fullName,
      email: customerData.email,
      phoneNumber: customerData.phone,
      address: deliveryInfo,
      cardNumber: paymentMethod,
      totalPrice: selectedItems.reduce((total, item) => total + item.price * item.quantity, 0),
      cartItemIds: selectedItems.map((item) => item.id),
    };

    await createOrder(orderData);
    dispatch(setItems(items.filter((item) => !item.selected)));
    selectedItems.forEach((item) => {
      dispatch(addNotification({ item, operation: 'order-confirmation', id: Date.now() }));
    });
  };

  useEffect(() => {
    if (removalQueue.length > 0) {
      const interval = setInterval(() => {
        dispatch(setCurrentRemovalIndex((currentRemovalIndex + 1) % removalQueue.length));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [removalQueue, dispatch, currentRemovalIndex]);

  return (
    <div className="cart-page">
      <div className="cart-left">
        <div className="cart-header">
          <div className="select-all-container">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={items.every(item => item.selected)}
                onChange={handleSelectAll}
              />
              <span className="checkmark"></span>
            </label>
            <span className="select-all-label">Выбрать все</span>
          </div>
          <div className="action-links">
            <a onClick={handleDeleteAllSelected} className="action-link">Удалить выбранное</a>
            <a onClick={handleDeleteAll} className="action-link">Очистить корзину</a>
          </div>
        </div>

        <div className="cart-items">
          {items.length > 0 ? (
            items.map((item: CartItemDto) => (
              <div key={item.id} className="cart-item">
                <div className="image-container">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={(e) => handleSelectedChange(item.id, e.target.checked)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <img src="/image/placeholder.svg" alt={item.name} />
                  )}
                </div>

                <div className="item-details">
                  <Link to={`/${categoryMapping[item.type.slice(0, 3)]}/${item.productId}`}
                        className="product-link">
                    <h3>{item.name}</h3>
                  </Link>
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
                    <img src="/image/svg/trash.svg" alt="Remove" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <img src="/image/png/cartNothing.png" alt="Empty Cart" />
              <h2>Ваша корзина пуста</h2>
              <p>Самое время добавить в нее что-нибудь</p>
            </div>
          )}
        </div>
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
          </>
        )}
        <div className="total-price">Итоговая цена: {totalPrice.toFixed(2)} $</div>
        <button className="order-button" onClick={handleOrderSubmit}>
          Оформить заказ
        </button>
      </div>

      {removalQueue.length > 0 && (
        <Notification
          key="removal-notification"
          item={removalQueue[currentRemovalIndex]}
          onCancel={handleNotificationCancel}
          onComplete={handleNotificationComplete}
          index={0}
          operation="remove"
        />
      )}
    </div>
  );
};

export default CartPage;
