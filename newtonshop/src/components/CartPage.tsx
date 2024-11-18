import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    createOrder,
    deleteCartItem,
    getCartItems,
    getCurrentProfile,
    selectAllCartItems, setAllToUnselected,
    updateCartItem
} from "../Api";
import {CartItemDto, OrderRequestDto} from "../types";
import Notification from "./Notification";
import "./CartPage.css";
import "./Notification.css";
import {Link} from "react-router-dom";
import {categoryMapping} from "./products/AllProducts";
import {
    setItems,
    setCustomerData,
    setDeliveryInfo,
    setPaymentMethod,
    setCurrentStep,
    addNotification,
    removeNotification,
    updateItem,
    removeItem,
    setOrderNotification,
} from "./slices/cartSlice";
import {RootState} from "../store";

const CartPage = () => {
    const dispatch = useDispatch();
    const {
        items,
        customerData,
        deliveryInfo,
        paymentMethod,
        currentStep,
        notifications,
        orderNotification
    } = useSelector(
        (state: RootState) => state.cart
    );

    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
            } catch (error) {
                console.error("Не получил данные походу", error);
            }
        };

        const fetchCartItems = async () => {
            try {
                const cartItems = await getCartItems();
                dispatch(setItems(cartItems));
            } catch (error) {
                console.error("И тут тоже не получил данные походу", error);
            }
        };

        fetchUserData();
        fetchCartItems();
    }, [dispatch]);

    const handleQuantityChange = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        try {
            const item = items.find((item) => item.id === id);
            if (item) {
                const updatedItem = await updateCartItem(id, quantity, item.selected);
                dispatch(updateItem(updatedItem));
            }
        } catch (error) {
            console.error("Не удалось обновить количество:", error);
        }
    };

    const handleSelectedChange = async (id: number, selected: boolean) => {
        try {
            const item = items.find((item) => item.id === id);
            if (item) {
                const updatedItem = await updateCartItem(id, item.quantity, selected);
                dispatch(updateItem(updatedItem));
            }
        } catch (error) {
            console.error("Не удалось обновить выбор:", error);
        }
    };

    const handleNotificationCancel = (id: number) => {
        dispatch(removeNotification(id));
    };

    const handleRemoveItem = async (id: number) => {
        const itemToRemove = items.find((item) => item.id === id);
        if (itemToRemove) {
            const isItemInNotifications = notifications.some((notification) => notification.item.id === itemToRemove.id);
            if (!isItemInNotifications) {
                dispatch(addNotification({id, item: itemToRemove}));
            }
        }
    };

    const handleNotificationComplete = async (id: number) => {
        const notification = notifications.find((notification) => notification.id === id);
        if (notification) {
            try {
                await deleteCartItem(notification.item.id);
                dispatch(removeItem(notification.item.id));
                dispatch(removeNotification(id));
            } catch (error) {
                console.error("Не удалилась походу", error);
            }
        }
    };

    const handleCustomerDataChange = (field: string, value: string) => {
        dispatch(setCustomerData({...customerData, [field]: value}));
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
            dispatch(setCurrentStep(4));
        }
    };

    const handleSelectAll = async () => {
        try {
            const allSelected = items.every(item => item.selected);
            if (allSelected) {
                const updatedItems = await setAllToUnselected();
                dispatch(setItems(updatedItems));
            } else {
                const updatedItems = await selectAllCartItems();
                dispatch(setItems(updatedItems));
            }
        } catch (error) {
            console.error("Не удалось выбрать/снять выбор всех товаров:", error);
        }
    };

    const handleDeleteAllSelected = async () => {
        const selectedItems = items.filter(item => item.selected);
        if (selectedItems.length === 0) {
            alert("Пожалуйста, выберите товары для удаления.");
            return;
        }

        selectedItems.forEach(item => {
            dispatch(addNotification({id: item.id, item}));
        });

        try {
            await Promise.all(selectedItems.map(item => deleteCartItem(item.id)));
            dispatch(setItems(items.filter(item => !item.selected)));
        } catch (error) {
            console.error("Не удалось удалить выбранные товары:", error);
        }
    };

    const handleDeleteAll = async () => {
        items.forEach(item => {
            dispatch(addNotification({id: item.id, item}));
        });

        try {
            await Promise.all(items.map(item => deleteCartItem(item.id)));
            dispatch(setItems([]));
        } catch (error) {
            console.error("Не удалось очистить корзину:", error);
        }
    };

    const DottedLine = () => (
        <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
            <line x1="0" y1="1" x2="100" y2="1" stroke="#514ed9" strokeWidth="2" strokeDasharray="5,5"/>
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

        try {
            await createOrder(orderData);
            dispatch(setItems(items.filter((item) => !item.selected)));
            dispatch(setOrderNotification({items: selectedItems, index: 0}));
        } catch (error) {
            console.error("Не удалось оформить заказ", error);
        }
    };

    useEffect(() => {
        if (orderNotification) {
            const interval = setInterval(() => {
                const newIndex = (orderNotification.index + 1) % orderNotification.items.length;
                dispatch(setOrderNotification({...orderNotification, index: newIndex}));
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [orderNotification, dispatch]);

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
                                        <img src={item.imageUrl} alt={item.name}/>
                                    ) : (
                                        <img src="/image/placeholder.svg" alt={item.name}/>
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
                                        <img src="/image/svg/trash.svg" alt="Remove"/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-cart">
                            <img src="/image/png/cartNothing.png" alt="Empty Cart"/>
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
                {currentStep >= 2 && <DottedLine/>}
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
                        {currentStep >= 3 && <DottedLine/>}
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
                        {currentStep >= 4 && <DottedLine/>}
                    </>
                )}
                {currentStep >= 4 && (
                    <>
                        <div className="step-circle">{currentStep >= 4 ? 4 : ""}</div>
                        <div className="step-text">Подтверждение товара</div>
                    </>
                )}
                <div className="total-price">Итоговая цена: {totalPrice.toFixed(2)} $</div>
                <button className="order-button" onClick={handleOrderSubmit}>
                    Оформить заказ
                </button>
            </div>

            {notifications.map((notification, index) => (
                <Notification
                    key={notification.id}
                    item={notification.item}
                    onCancel={() => handleNotificationCancel(notification.id)}
                    onComplete={() => handleNotificationComplete(notification.id)}
                    index={index}
                    operation="remove"
                />
            ))}

            {orderNotification && (
                <Notification
                    key="order-confirmation"
                    item={orderNotification.items[orderNotification.index]}
                    onCancel={() => dispatch(setOrderNotification(null))}
                    onComplete={() => dispatch(setOrderNotification(null))}
                    index={0}
                    operation="order-confirmation"
                />
            )}
        </div>
    );
};

export default CartPage;
