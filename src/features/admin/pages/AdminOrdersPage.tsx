// features/admin/pages/AdminOrdersPage.tsx
import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../orders/store/useOrderStore";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAdminProfile } from "../../profiles/hooks/useAdminProfile";
import { Container } from "../../../shared/components/Container";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Mail,
  User,
  MapPin,
  CreditCard,
  Calendar,
  MessageSquare,
} from "lucide-react";
// import { SMSHistory } from "../components/SMSHistory";
import { format } from "date-fns";

type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-200",
    icon: Clock,
    nextSteps: ["processing", "cancelled"],
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-200",
    icon: Package,
    nextSteps: ["confirmed", "cancelled"],
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-200",
    icon: CheckCircle,
    nextSteps: ["shipped", "cancelled"],
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    borderColor: "border-purple-200",
    icon: Package,
    nextSteps: ["delivered", "cancelled"],
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800",
    borderColor: "border-emerald-200",
    icon: CheckCircle,
    nextSteps: [],
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-200",
    icon: XCircle,
    nextSteps: [],
  },
};

export const AdminOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminProfile();
  const { orders, isLoading, error, loadOrders, updateOrderStatus, hasLoaded } =
    useOrderStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "sms">("orders");
  const [expandedAll, setExpandedAll] = useState(false);

  // Load orders when component mounts
  useEffect(() => {
    if (user && isAdmin && !hasLoaded) {
      loadOrders(user.id, true);
    }
  }, [user, isAdmin, loadOrders, hasLoaded]);

  // Toggle individual order
  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Expand/Collapse all
  const toggleExpandAll = () => {
    if (expandedAll) {
      setExpandedOrders(new Set());
      setExpandedAll(false);
    } else {
      setExpandedOrders(new Set(filteredOrders.map((order) => order.id)));
      setExpandedAll(true);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shipping_address.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    if (!user || !isAdmin) return;

    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, user.id, newStatus, true);
      setShowSuccess(orderId);
      setTimeout(() => setShowSuccess(null), 3000);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    return stats;
  };

  if (adminLoading || isLoading) {
    return (
      <Container>
        <div className="py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-24 rounded-lg"></div>
              ))}
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container>
        <div className="py-16 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-16 text-center">
          <p className="text-red-500">Failed to load orders</p>
          <button
            onClick={() => user && loadOrders(user.id, true)}
            className="mt-4 text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and update customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-blue-600">
              {stats.processing}
            </p>
            <p className="text-sm text-gray-600">Processing</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </p>
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-purple-600">
              {stats.shipped}
            </p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-emerald-600">
              {stats.delivered}
            </p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "orders"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("sms")}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === "sms"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              SMS History
            </button>
          </div>

          {/* Expand/Collapse All Button - Only show when in Orders tab */}
          {activeTab === "orders" && filteredOrders.length > 0 && (
            <button
              onClick={toggleExpandAll}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              {expandedAll ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Expand All ({filteredOrders.length})
                </>
              )}
            </button>
          )}
        </div>

        {/* Filters */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, email, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="relative sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as OrderStatus | "all")
                  }
                  className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "orders" ? (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const isExpanded = expandedOrders.has(order.id);

                return (
                  <div
                    key={order.id}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all border-l-4 ${
                      statusConfig[order.status].borderColor
                    }`}
                  >
                    {/* Clickable Header */}
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpand(order.id)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <p className="font-mono text-lg font-semibold text-gray-900">
                              #{order.order_number}
                            </p>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${statusConfig[order.status].color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[order.status].label}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(
                                new Date(order.created_at),
                                "MMM dd, yyyy • hh:mm a",
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {order.shipping_address.full_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {order.items.length} items
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              ₦{order.total.toLocaleString()}
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
                    </div>

                    {/* Expanded Details - Only shown when expanded */}
                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        <div className="p-6 bg-gray-50">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Customer Information */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <User className="w-5 h-5 text-primary" />
                                <h4 className="font-semibold text-gray-900">
                                  Customer Information
                                </h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-900">
                                  {order.shipping_address.full_name}
                                </p>
                                <p className="text-gray-600 break-all">
                                  {order.shipping_address.email}
                                </p>
                                <p className="text-gray-600">
                                  {order.shipping_address.phone}
                                </p>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
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
                                  {order.shipping_address.city},{" "}
                                  {order.shipping_address.state}
                                </p>
                                <p>{order.shipping_address.country}</p>
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <h4 className="font-semibold text-gray-900">
                                  Order Summary
                                </h4>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Subtotal
                                  </span>
                                  <span>
                                    ₦{order.subtotal.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Shipping
                                  </span>
                                  <span className="text-green-600">Free</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                  <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span className="text-primary">
                                      ₦{order.total.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                  Payment:{" "}
                                  <span className="capitalize">
                                    {order.payment_method.replace(/_/g, " ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b">
                              <h4 className="font-semibold text-gray-900">
                                Order Items ({order.items.length})
                              </h4>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="p-4 flex items-center gap-4 hover:bg-gray-50"
                                >
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

                          {/* Status Update Controls */}
                          {statusConfig[order.status].nextSteps.length > 0 && (
                            <div className="mt-6">
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Update Order Status
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {statusConfig[order.status].nextSteps.map(
                                  (nextStatus) => (
                                    <button
                                      key={nextStatus}
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order.id,
                                          nextStatus as OrderStatus,
                                        )
                                      }
                                      disabled={updatingOrder === order.id}
                                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                        updatingOrder === order.id
                                          ? "bg-gray-100 text-gray-400 cursor-wait"
                                          : statusConfig[
                                              nextStatus as OrderStatus
                                            ].color
                                      }`}
                                    >
                                      {updatingOrder === order.id ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <>
                                          {nextStatus === "processing" && (
                                            <Package className="w-4 h-4" />
                                          )}
                                          {nextStatus === "confirmed" && (
                                            <CheckCircle className="w-4 h-4" />
                                          )}
                                          {nextStatus === "shipped" && (
                                            <Truck className="w-4 h-4" />
                                          )}
                                          {nextStatus === "delivered" && (
                                            <CheckCircle className="w-4 h-4" />
                                          )}
                                          {nextStatus === "cancelled" && (
                                            <XCircle className="w-4 h-4" />
                                          )}
                                          Mark as{" "}
                                          {
                                            statusConfig[
                                              nextStatus as OrderStatus
                                            ].label
                                          }
                                        </>
                                      )}
                                    </button>
                                  ),
                                )}
                              </div>

                              {/* Success Message */}
                              {showSuccess === order.id && (
                                <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  Status updated successfully!
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div>No orders found</div>
        )}
      </Container>
    </div>
  );
};
