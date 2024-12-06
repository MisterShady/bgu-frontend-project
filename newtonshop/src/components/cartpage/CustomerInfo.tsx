import React from "react";
import MapComponent from "./MapComponent";

interface CustomerInfoProps {
  customerData: { fullName: string; phone: string; email: string };
  deliveryInfo: string;
  paymentMethod: string;
  onCustomerDataChange: (field: string, value: string) => void;
  onDeliveryInfoChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
  onAddressSelect: (address: string) => void;
  totalPrice: number;
  onOrderSubmit: () => void;
}

const DottedLine = () => (
  <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
    <line x1="0" y1="1" x2="100" y2="1" stroke="#514ed9" strokeWidth="2" strokeDasharray="5,5" />
  </svg>
);

const CustomerInfo = ({
  customerData,
  deliveryInfo,
  paymentMethod,
  onCustomerDataChange,
  onDeliveryInfoChange,
  onPaymentMethodChange,
  onAddressSelect,
  totalPrice,
  onOrderSubmit,
}: CustomerInfoProps) => {
  return (
    <div className="customer-info">
      <div className="step-circle">1</div>
      <div className="step-text">Данные покупателя</div>
      <input
        type="text"
        placeholder="ФИО"
        value={customerData.fullName}
        onChange={(e) => onCustomerDataChange("fullName", e.target.value)}
      />
      <input
        type="text"
        placeholder="Номер телефона"
        value={customerData.phone}
        onChange={(e) => onCustomerDataChange("phone", e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={customerData.email}
        onChange={(e) => onCustomerDataChange("email", e.target.value)}
      />
      <DottedLine />

      <div className="step-circle">2</div>
      <div className="step-text">Место получения товара</div>
      <input
        type="text"
        placeholder={deliveryInfo || "Укажите адрес доставки"}
        value={deliveryInfo}
        onChange={(e) => onDeliveryInfoChange(e.target.value)}
      />
      <div className="map-container">
        <MapComponent onSelectAddress={onAddressSelect} />
      </div>
      <DottedLine />

      <div className="step-circle">3</div>
      <div className="step-text">Способ оплаты</div>
      <input
        type="text"
        placeholder="Номер карты"
        value={paymentMethod}
        onChange={(e) => onPaymentMethodChange(e.target.value)}
      />
      <DottedLine />

      <div className="total-price">Итоговая цена: {totalPrice.toFixed(2)} $</div>
      <button className="order-button" onClick={onOrderSubmit}>
        Оформить заказ
      </button>
    </div>
  );
};

export default CustomerInfo;
