import React from "react";
import { useCartStore } from "../features/cart/store/useCartStore";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useCreateOrder } from "../features/orders/hooks/useOrders";
import { useNavigate } from "react-router-dom";

export const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate, isLoading, error } = useCreateOrder();

  const handleCheckout = () => {
    if (!user) return;

    mutate(
      { userId: user.id, items },
      {
        onSuccess: () => {
          clearCart();
          alert("Order placed successfully!");
          navigate("/");
        },
      },
    );
  };

  if (items.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between p-4 border rounded-lg shadow-sm"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-600">
                ${item.price} x {item.quantity}
              </p>
            </div>
            <p className="font-semibold">${item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ${total()}</p>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="py-2 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Place Order"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{(error as any).message}</p>}
    </div>
  );
};
