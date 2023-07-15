"use client";

import { OrderItem, Cart } from "@/types/Types";
import { getCart, removeCartItem, updateCartItem } from "@/lib/commerce";
import { useEffect, useState } from "react";

const handleRemoveClick = async (
  orderItemType: string,
  orderItemId: string,
  cartId: string
) => {
  try {
    const result = await removeCartItem(orderItemType, orderItemId, cartId);
    if (result) {
      alert("Removed product " + orderItemId);
    }
  } catch (error) {
    alert("Error removing product " + orderItemId + ": " + error);
  }
};

const handleUpdateClick = async (
  cartId: string,
  orderItemType: string,
  orderItemId: string,
  quantity: number
) => {
  try {
    const result = await updateCartItem(
      orderItemType,
      orderItemId,
      quantity,
      cartId
    );
    if (result.success) {
      alert("Updated product " + orderItemId);
    }
  } catch (error) {
    alert("Error updating product " + orderItemId + ": " + error);
  }
};

const refreshCart = async (
  setCart: (cart: Cart) => void,
  setOrderItems: (orderItems: Array<OrderItem>) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  try {
    const result = await getCart();
    setCart(result.data[0]);
    setOrderItems(
      result?.included?.filter((item: OrderItem) => item?.type === "order-item--default")
    );
    setIsLoading(false);
  } catch (error) {
    alert("Error refreshing cart: " + error);
  }
};

export default function Cart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [orderItems, setOrderItems] = useState<Array<OrderItem> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    refreshCart(setCart, setOrderItems, setIsLoading);
  }, []);

  if (!cart || isLoading) return <div>Loading... </div>;
  if (!orderItems) return <div>Cart is empty </div>;

  return (
    <div>
      <ul>
        {orderItems &&
          orderItems.map((orderItem: any) => {
            return (
              <li key={orderItem?.id}>
                <input
                  type="number"
                  className={`w-10`}
                  value={parseInt(orderItem?.attributes?.quantity)}
                  onChange={async (event) => {
                    setIsLoading(true);
                    await handleUpdateClick(
                      cart.id,
                      orderItem.type,
                      orderItem.id,
                      parseInt(event.target.value)
                    );
                    refreshCart(setCart, setOrderItems, setIsLoading);
                  }}
                />
                {"x " +
                  orderItem?.attributes?.title +
                  " " +
                  orderItem?.attributes?.total_price?.formatted +
                  " "}
                <button
                  className={`font-bold`}
                  onClick={async () => {
                    setIsLoading(true);
                    await handleRemoveClick(
                      orderItem.type,
                      orderItem.id,
                      cart.id
                    );
                    refreshCart(setCart, setOrderItems, setIsLoading);
                  }}
                >
                  Remove
                </button>
              </li>
            );
          })}
      </ul>
      <div className={`mt-5`}>Total: {cart?.attributes?.total_price?.formatted}</div>
    </div>
  );
}
