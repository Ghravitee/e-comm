import { useCartStore } from "../store/useCartStore";
import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ← import this

export const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, removeItem, increaseQty, decreaseQty, total } = useCartStore();
  const navigate = useNavigate(); // ← initialize navigate

  const handleCheckout = () => {
    setOpen(false); // close the cart drawer
    navigate("/checkout"); // navigate to checkout page
  };

  return (
    <>
      {/* Cart Button */}
      <button
        className="cursor-pointer fixed top-4 right-4 z-40 flex items-center justify-center p-2 rounded-full bg-green-600 hover:bg-green-700 transition"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="text-2xl text-white" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white font-bold">
            {items.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <X className="text-gray-700" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 && (
            <p className="text-gray-500 text-center mt-10">
              Your cart is empty
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 font-semibold hover:text-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="font-semibold text-gray-900 text-lg">
            Total: ${total()}
          </p>
          <button
            onClick={() => {
              if (items.length === 0) {
                alert("Your cart is empty! Add some products before checkout.");
                return;
              }
              handleCheckout();
            }}
            className="w-full mt-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};
