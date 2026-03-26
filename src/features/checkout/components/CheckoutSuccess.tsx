// features/checkout/components/CheckoutSuccess.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { OrderWithItems } from "../../orders/types";
import { CheckCircle, Package, Truck, Home } from "lucide-react";

interface CheckoutSuccessProps {
  order: OrderWithItems;
  onContinue: () => void;
}

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  order,
  onContinue,
}) => {
  // Calculate estimated delivery (5-7 days from now)
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 7);
  const formattedDate = estimatedDate.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. Your order number is:
          </p>
          <p className="text-primary font-mono text-lg font-semibold mt-1">
            {order.order_number}
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₦
                    {item.product_price.toLocaleString()}
                  </p>
                </div>
                <p className="font-medium">₦{item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">
                ₦{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-gray-600">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-gray-600 capitalize">
                  {order.payment_method.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Shipping Address</p>
                <p className="text-gray-600">
                  {order.shipping_address.full_name}
                  <br />
                  {order.shipping_address.address_line1}
                  {order.shipping_address.address_line2 && (
                    <>, {order.shipping_address.address_line2}</>
                  )}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.state}
                  <br />
                  {order.shipping_address.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            to="/orders"
            onClick={onContinue}
            className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/80 transition-colors text-center font-medium"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
