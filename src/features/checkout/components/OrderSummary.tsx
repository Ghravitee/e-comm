// features/checkout/components/OrderSummary.tsx
import React from "react";
import type { CartItem } from "../../cart/store/useCartStore";
import { ShoppingBag, Truck, ShieldCheck } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>

      {/* Items List */}
      <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium">
              ₦{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span>₦0</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="mt-6 pt-4 border-t space-y-3">
        <div className="flex items-start gap-2 text-sm text-gray-500">
          <Truck className="w-4 h-4 mt-0.5" />
          <span>Free delivery on all orders</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-500">
          <ShieldCheck className="w-4 h-4 mt-0.5" />
          <span>Secure checkout with SSL encryption</span>
        </div>
      </div>
    </div>
  );
};
