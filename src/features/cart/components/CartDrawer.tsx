import { useCartStore } from "../store/useCartStore";
import { ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, increaseQty, decreaseQty, total } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose(); // close the cart drawer
    navigate("/checkout"); // navigate to checkout page
  };

  return (
    <>
      {/* Cart Button - This is now removed since we're using the navbar button */}

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity z-40 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
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
              className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition border"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 font-semibold hover:text-red-600 transition ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-gray-700">Subtotal:</span>
            <p className="font-semibold text-gray-900 text-lg">
              ${total().toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => {
              if (items.length === 0) {
                alert("Your cart is empty! Add some products before checkout.");
                return;
              }
              handleCheckout();
            }}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Proceed to Checkout
          </button>

          {/* Continue shopping button */}
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 text-gray-600 hover:text-gray-800 transition font-medium text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
};
