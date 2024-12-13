import React from "react";
import { Link } from "react-router-dom";
import { CartItemDto } from "../../types";
import { categoryMapping } from "../categoryMapping";

interface CartItemProps {
  item: CartItemDto;
  onQuantityChange: (id: number, quantity: number) => void;
  onSelectedChange: (id: number, selected: boolean) => void;
  onRemoveItem: (id: number) => void;
}

const CartItem = ({ item, onQuantityChange, onSelectedChange, onRemoveItem }: CartItemProps) => {
  return (
    <div className="cart-item">
      <div className="image-container">
        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={(e) => onSelectedChange(item.id, e.target.checked)}
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
        <Link
          to={`/${categoryMapping[item.type.slice(0, 3)]}/${item.productId}`}
          className="product-link"
        >
          <h3>{item.name}</h3>
        </Link>
        <div className="quantity-container">
          <button className="quantity-button left" onClick={() => onQuantityChange(item.id, item.quantity - 1)}>
            -
          </button>
          <span>{item.quantity}</span>
          <button className="quantity-button right" onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
            +
          </button>
        </div>
        <div className="config-items">
          {item.config.split(",").map((configItem: string, index: number) => (
            <p key={index}>{configItem.trim()}</p>
          ))}
        </div>
        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
        <button onClick={() => onRemoveItem(item.id)} className="remove-button">
          <img src="/image/svg/trash.svg" alt="Remove" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
