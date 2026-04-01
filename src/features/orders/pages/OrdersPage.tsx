// features/orders/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../store/useOrderStore";
import { useAuth } from "../../auth/hooks/useAuth";
// import { useRealtimeOrders } from "../hooks/useRealtimeOrders";
import { Container } from "../../../shared/components/Container";
import { OrderCard } from "../components/OrderCard";
import {
  Package,
  ShoppingBag,
  Clock,
  Package as PackageIcon,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { devError } from "../../../shared/utils/logger";

// Status definitions with explanations (same as before)
const statusDefinitions = {
  pending: {
    label: "Pending",
    description: "Your order has been received and is awaiting confirmation.",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    steps: [
      "✅ Order received",
      "⏳ Waiting for admin confirmation",
      "📧 You'll receive an email when confirmed",
    ],
  },
  processing: {
    label: "Processing",
    description: "Your order is being prepared for shipment.",
    icon: PackageIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    steps: [
      "✅ Order confirmed",
      "📦 Being packaged",
      "🔍 Quality check in progress",
    ],
  },
  confirmed: {
    label: "Confirmed",
    description: "Your order has been confirmed and is ready for shipping.",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    steps: [
      "✅ Order processed",
      "📋 Ready for pickup by courier",
      "🚚 Will be shipped soon",
    ],
  },
  shipped: {
    label: "Shipped",
    description: "Your order is on its way to your delivery address.",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    steps: [
      "📦 Package handed to courier",
      "🚚 In transit to your location",
      "📱 Track your order for updates",
    ],
  },
  delivered: {
    label: "Delivered",
    description: "Your order has been delivered. Enjoy your purchase!",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    steps: [
      "✅ Order delivered",
      "📦 Package received",
      "⭐ Please leave a review if you enjoyed the product",
    ],
  },
  cancelled: {
    label: "Cancelled",
    description:
      "Your order has been cancelled. Contact support if you have questions.",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    steps: [
      "❌ Order cancelled",
      "💳 No payment was processed",
      "📞 Contact support for assistance",
    ],
  },
};

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { orders, isLoading, error, loadOrders, hasLoaded } = useOrderStore();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load orders on initial mount
  useEffect(() => {
    if (user && !hasLoaded) {
      loadOrders(user.id, false);
    }
  }, [user, loadOrders, hasLoaded]);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (!user) return;

    setIsRefreshing(true);
    try {
      await loadOrders(user.id, false);
      toast.success("Orders refreshed!", {
        duration: 2000,
        position: "top-right",
      });
    } catch (err) {
      devError("Failed to refresh orders. Please try again.", err);
      toast.error("Failed to refresh orders. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  // Loading state (initial load)
  if (isLoading && !hasLoaded) {
    return (
      <Container>
        <div className="py-16">
          <div className="animate-pulse space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-500 text-lg font-medium">
            Failed to load orders
          </p>
          <p className="text-gray-500 mt-2">Please try again later</p>
          <button
            onClick={() => user && loadOrders(user.id, false)}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  const statuses = [
    "all",
    "pending",
    "processing",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // Get counts for each status
  const getStatusCount = (status: string) => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Header with Info and Refresh Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500 mt-1">
                  Track and manage your orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh orders"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="text-sm">Refresh</span>
              </button>

              <Link
                to="/shop"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Status Filters with Counts */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statuses.map((status) => {
            const count = getStatusCount(status);
            const statusDef =
              status !== "all"
                ? statusDefinitions[status as keyof typeof statusDefinitions]
                : null;

            return (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`relative px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                  activeFilter === status
                    ? status !== "all"
                      ? `${statusDef?.bgColor} ${statusDef?.color} border-2 ${statusDef?.borderColor}`
                      : "bg-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {status !== "all" && statusDef && (
                    <statusDef.icon className="w-4 h-4" />
                  )}
                  <span>{status === "all" ? "All Orders" : status}</span>
                  <span
                    className={`text-sm ${activeFilter === status ? "opacity-100" : "opacity-60"}`}
                  >
                    ({count})
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Status Info Card (for selected filter) */}
        {activeFilter !== "all" &&
          statusDefinitions[activeFilter as keyof typeof statusDefinitions] && (
            <div
              className={`mb-6 p-4 rounded-lg border ${statusDefinitions[activeFilter as keyof typeof statusDefinitions].borderColor} ${statusDefinitions[activeFilter as keyof typeof statusDefinitions].bgColor}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${statusDefinitions[activeFilter as keyof typeof statusDefinitions].bgColor} border ${statusDefinitions[activeFilter as keyof typeof statusDefinitions].borderColor}`}
                >
                  {(() => {
                    const Icon =
                      statusDefinitions[
                        activeFilter as keyof typeof statusDefinitions
                      ].icon;
                    return (
                      <Icon
                        className={`w-5 h-5 ${statusDefinitions[activeFilter as keyof typeof statusDefinitions].color}`}
                      />
                    );
                  })()}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${statusDefinitions[activeFilter as keyof typeof statusDefinitions].color}`}
                  >
                    {
                      statusDefinitions[
                        activeFilter as keyof typeof statusDefinitions
                      ].label
                    }{" "}
                    Orders
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {
                      statusDefinitions[
                        activeFilter as keyof typeof statusDefinitions
                      ].description
                    }
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">What to expect:</p>
                    <ul className="mt-1 space-y-1">
                      {statusDefinitions[
                        activeFilter as keyof typeof statusDefinitions
                      ].steps.map((step, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No orders found</p>
            <p className="text-gray-400 mt-2 max-w-md mx-auto">
              {activeFilter === "all"
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : `You don't have any ${activeFilter} orders.`}
            </p>
            <Link
              to="/shop"
              className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Optional: Show last updated time */}
            {orders.length > 0 && (
              <div className="text-right text-xs text-gray-400 mb-2">
                {isRefreshing ? "Refreshing..." : `${orders.length} orders`}
              </div>
            )}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={selectedOrderId === order.id}
                  onToggle={() =>
                    setSelectedOrderId(
                      selectedOrderId === order.id ? null : order.id,
                    )
                  }
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};
