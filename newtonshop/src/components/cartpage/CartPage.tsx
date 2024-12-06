import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  deleteAllCartItems,
  deleteAllSelectedCartItems,
  deleteCartItem,
  getCartItems,
  getCurrentProfile,
  selectAllCartItems,
  setAllToUnselected,
  updateCartItem,
} from "../../Api";
import { CartItemDto, OrderRequestDto } from "../../types";
import "./CartPage.css";
import {
  clearRemovalQueue,
  removeItem,
  setCurrentRemovalIndex,
  setCustomerData,
  setDeliveryInfo,
  setItems,
  setPaymentMethod,
  setRemovalQueue,
  updateItem,
} from "../slices/cartSlice";
import { RootState } from "../../store";
import CartItem from "./CartItem";
import CustomerInfo from "./CustomerInfo";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, customerData, deliveryInfo, paymentMethod } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const data = await getCurrentProfile();
        dispatch(
          setCustomerData({
            fullName: data.fullName,
            phone: data.phoneNumber,
            email: data.email,
          })
        );
      }
    };

    const fetchCartItems = async (): Promise<void> => {
      const cartItems = await getCartItems();
      dispatch(setItems(cartItems));
    };

    fetchUserData();
    fetchCartItems();
  }, [dispatch]);

  const handleAddressSelect = (address: string) => {
    dispatch(setDeliveryInfo(address));
  };

  const handleQuantityChange = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    const item = items.find((item: CartItemDto) => item.id === id);
    if (item) {
      const updatedItem = await updateCartItem(id, quantity, item.selected);
      dispatch(updateItem(updatedItem));
    }
  };

  const handleSelectedChange = async (id: number, selected: boolean) => {
    const item = items.find((item: CartItemDto) => item.id === id);
    if (item) {
      const updatedItem = await updateCartItem(id, item.quantity, selected);
      dispatch(updateItem(updatedItem));
    }
  };

  const handleRemoveItem = async (id: number) => {
    dispatch(setRemovalQueue([items.find((item: CartItemDto) => item.id === id)!]));
    dispatch(setCurrentRemovalIndex(0));
    await deleteCartItem(id);
    dispatch(removeItem(id));
    dispatch(clearRemovalQueue());
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    dispatch(setCustomerData({ ...customerData, [field]: value }));
  };

  const handleDeliveryInfoChange = (value: string) => {
    dispatch(setDeliveryInfo(value));
  };

  const handlePaymentMethodChange = (value: string) => {
    const formattedValue =
      value
        .replace(/\D/g, "")
        .match(/.{1,4}/g)
        ?.join("-") || "";
    if (formattedValue.length <= 19) {
      dispatch(setPaymentMethod(formattedValue));
    }
  };

  const handleSelectAll = async () => {
    const allSelected = items.every((item: CartItemDto) => item.selected);
    if (allSelected) {
      const updatedItems = await setAllToUnselected();
      dispatch(setItems(updatedItems));
    } else {
      const updatedItems = await selectAllCartItems();
      dispatch(setItems(updatedItems));
    }
  };

  const handleDeleteAllSelected = async () => {
    const selectedItems = items.filter((item: CartItemDto) => item.selected);
    if (selectedItems.length === 0) {
      alert("Пожалуйста, выберите товары для удаления.");
      return;
    }

    await deleteAllSelectedCartItems();
    dispatch(setItems(items.filter((item: CartItemDto) => !item.selected)));
  };

  const handleDeleteAll = async () => {
    if (items.length === 0) {
      alert("Нет товаров в корзине :(");
      return;
    }

    await deleteAllCartItems();
    dispatch(setItems([]));
  };

  const totalPrice = items.reduce(
    (total: number, item: CartItemDto) => (item.selected ? total + item.price * item.quantity : total),
    0
  );

  const handleOrderSubmit = async () => {
    const selectedItems = items.filter((item: CartItemDto) => item.selected);
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
      totalPrice: selectedItems.reduce((total: number, item: CartItemDto) => total + item.price * item.quantity, 0),
      cartItemIds: selectedItems.map((item: CartItemDto) => item.id),
    };

    await createOrder(orderData);
    dispatch(setItems(items.filter((item: CartItemDto) => !item.selected)));
  };

  return (
    <div className="cart-page">
      <div className="cart-left">
        <div className="cart-header">
          <div className="select-all-container">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={items.every((item: CartItemDto) => item.selected)}
                onChange={handleSelectAll}
              />
              <span className="checkmark"></span>
            </label>
            <span className="select-all-label">Выбрать все</span>
          </div>
          <div className="action-links">
            <a onClick={handleDeleteAllSelected} className="action-link">
              Удалить выбранное
            </a>
            <a onClick={handleDeleteAll} className="action-link">
              Очистить корзину
            </a>
          </div>
        </div>

        <div className="cart-items">
          {items.length > 0 ? (
            items.map((item: CartItemDto) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onSelectedChange={handleSelectedChange}
                onRemoveItem={handleRemoveItem}
              />
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

      <CustomerInfo
        customerData={customerData}
        deliveryInfo={deliveryInfo}
        paymentMethod={paymentMethod}
        onCustomerDataChange={handleCustomerDataChange}
        onDeliveryInfoChange={handleDeliveryInfoChange}
        onPaymentMethodChange={handlePaymentMethodChange}
        onAddressSelect={handleAddressSelect}
        totalPrice={totalPrice}
        onOrderSubmit={handleOrderSubmit}
      />
    </div>
  );
};

export default CartPage;
