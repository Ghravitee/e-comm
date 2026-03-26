// features/orders/components/OrderCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { OrderWithItems } from "../types";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  User,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

interface OrderCardProps {
  order: OrderWithItems;
  isExpanded: boolean;
  onToggle: () => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: Clock,
    message:
      "Your order is pending confirmation. We'll notify you once it's confirmed.",
  },
  processing: {
    label: "Processing",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Package,
    message:
      "Your order is being prepared. We're getting it ready for shipment.",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
    message: "Your order has been confirmed and is ready for shipping.",
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Truck,
    message:
      "Your order is on its way! Track your package for delivery updates.",
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: CheckCircle,
    message: "Your order has been delivered. We hope you enjoy your purchase!",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Package,
    message:
      "This order has been cancelled. Contact support if you have questions.",
  },
};

const orderTimeline = [
  {
    status: "pending",
    label: "Order Placed",
    description: "Order received and awaiting confirmation",
  },
  {
    status: "processing",
    label: "Processing",
    description: "Preparing your order",
  },
  {
    status: "confirmed",
    label: "Confirmed",
    description: "Order confirmed and ready",
  },
  { status: "shipped", label: "Shipped", description: "On its way to you" },
  { status: "delivered", label: "Delivered", description: "Order completed" },
];

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isExpanded,
  onToggle,
}) => {
  const currentStatus = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = currentStatus.icon;
  const currentStepIndex = orderTimeline.findIndex(
    (step) => step.status === order.status,
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
      {/* Order Header */}
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="font-mono font-semibold text-gray-900">
                #{order.order_number}
              </p>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                <span>{currentStatus.label}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(order.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <ShoppingBag className="w-4 h-4" />
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                ₦{order.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {order.payment_method.replace(/_/g, " ")}
              </p>
            </div>
            <div className="text-gray-400">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MessageSquare className="w-3 h-3" />
          SMS updates sent to {order.shipping_address.phone}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          {/* Status Message */}
          <div
            className={`mb-6 p-4 rounded-lg ${currentStatus.bgColor} border ${currentStatus.borderColor}`}
          >
            <div className="flex items-start gap-3">
              <StatusIcon className={`w-5 h-5 ${currentStatus.color} mt-0.5`} />
              <div>
                <p className={`font-medium ${currentStatus.color}`}>
                  {currentStatus.message}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Need help? Contact our support team.
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {orderTimeline.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = step.status === order.status;
                const StepIcon =
                  step.status === "pending"
                    ? Clock
                    : step.status === "processing"
                      ? Package
                      : step.status === "confirmed"
                        ? CheckCircle
                        : step.status === "shipped"
                          ? Truck
                          : CheckCircle;

                return (
                  <div
                    key={step.status}
                    className="relative pl-10 pb-6 last:pb-0"
                  >
                    <div
                      className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p
                        className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {step.description}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-primary mt-1 font-medium">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">
                  Customer Information
                </h4>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {order.shipping_address.full_name}
                </p>
                <p className="text-gray-600">{order.shipping_address.email}</p>
                <p className="text-gray-600">{order.shipping_address.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-gray-900">
                  Shipping Address
                </h4>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-gray-900">Payment Summary</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary text-lg">
                    ₦{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Payment Method:{" "}
                <span className="capitalize">
                  {order.payment_method.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h4 className="font-semibold text-gray-900">Order Items</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50"
                >
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity} × ₦
                      {item.product_price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₦{item.subtotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Have questions about your order?
              <Link to="/contact" className="text-primary hover:underline ml-1">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
