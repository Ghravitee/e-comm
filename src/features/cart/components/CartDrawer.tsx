import { useCartStore } from "../store/useCartStore";
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, increaseQty, decreaseQty, total } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Your Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">
                Add some products to your cart
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                {/* Product Image */}
                <div className="size-10 shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 max-w-56 truncate text-sm break-all">
                        {item.name}
                      </h3>
                      <p className="text-primary font-semibold mt-1">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        disabled={item.quantity === 1}
                        className="p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="p-1.5 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white">
            {/* Order Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">
                  ₦{total().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary text-lg">
                  ₦{total().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Continue Shopping Button */}
            <button
              onClick={onClose}
              className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 transition-colors font-medium text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};
