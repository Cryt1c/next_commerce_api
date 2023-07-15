"use client";

import { OrderItem } from "@/types/Types";
import { addCartItems } from "@/lib/commerce";

interface ButtonProps {
  children: React.ReactNode;
  orderItem: OrderItem;
}

const handleAddClick = async (orderItem: OrderItem) => {
  try {
    const result = await addCartItems([orderItem]);
    if (result) {
      alert("Added product " + orderItem.title);
    }
  } catch (error) {
    alert("Error adding product " + orderItem.title + ": " + error);
  }
};

export const Button = ({ children, orderItem }: ButtonProps) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
      onClick={() => handleAddClick(orderItem)}
    >
      {children}
    </button>
  );
};
