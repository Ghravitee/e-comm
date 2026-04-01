// // features/admin/hooks/useRealtimeAdminOrders.ts
// import { useEffect, useState, useRef } from "react";
// import { supabase } from "../../../services/supabase/client";
// import { useOrderStore } from "../../orders/store/useOrderStore";
// import toast from "react-hot-toast";

// export const useRealtimeAdminOrders = (isAdmin: boolean) => {
//   const { loadOrders, updateOrderStatus } = useOrderStore();
//   const [isConnected, setIsConnected] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);

//   // Refs for deduplication
//   const subscriptionRef = useRef<any>(null);
//   const isSubscribedRef = useRef(false);
//   const processedUpdatesRef = useRef<Map<string, number>>(new Map());

//   // Get user ID once
//   useEffect(() => {
//     const getUserId = async () => {
//       const { data } = await supabase.auth.getUser();
//       setUserId(data.user?.id || null);
//     };
//     getUserId();
//   }, []);

//   // Clean old processed updates
//   const cleanProcessedUpdates = () => {
//     const now = Date.now();
//     processedUpdatesRef.current.forEach((timestamp, key) => {
//       if (now - timestamp > 3000) {
//         // Remove after 3 seconds
//         processedUpdatesRef.current.delete(key);
//       }
//     });
//   };

//   useEffect(() => {
//     if (!isAdmin || !userId) return;
//     if (isSubscribedRef.current) return;

//     // Load initial orders
//     loadOrders(userId, true, true);

//     const channelName = `admin-orders-${userId}`;

//     const subscription = supabase
//       .channel(channelName)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "orders",
//         },
//         async (payload) => {
//           const newOrder = payload.new as any;
//           const orderId = newOrder.id;

//           // Deduplicate
//           if (processedUpdatesRef.current.has(orderId)) {
//             console.log("Skipping duplicate new order:", orderId);
//             return;
//           }
//           processedUpdatesRef.current.set(orderId, Date.now());
//           cleanProcessedUpdates();

//           console.log("New order received:", newOrder);
//           await loadOrders(userId, true, true);

//           toast.success(`🛎️ New order received!`, {
//             duration: 5000,
//             position: "top-right",
//             id: `new-order-${orderId}`,
//             icon: "🛎️",
//           });
//         },
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "orders",
//         },
//         async (payload) => {
//           const updatedOrder = payload.new as any;
//           const orderId = updatedOrder.id;
//           const statusKey = `${orderId}-${updatedOrder.status}`;

//           // Deduplicate status updates
//           if (processedUpdatesRef.current.has(statusKey)) {
//             console.log("Skipping duplicate status update:", statusKey);
//             return;
//           }
//           processedUpdatesRef.current.set(statusKey, Date.now());
//           cleanProcessedUpdates();

//           console.log(
//             "Processing order update:",
//             updatedOrder.id,
//             updatedOrder.status,
//           );

//           // Get old order from store
//           const currentOrders = useOrderStore.getState().orders;
//           const oldOrder = currentOrders.find((o) => o.id === orderId);

//           // Only update if status actually changed
//           if (oldOrder && oldOrder.status !== updatedOrder.status) {
//             await updateOrderStatus(orderId, userId, updatedOrder.status, true);

//             toast(
//               `Order #${updatedOrder.order_number} status changed to ${updatedOrder.status}`,
//               {
//                 duration: 4000,
//                 position: "bottom-right",
//                 id: `status-${statusKey}`,
//                 icon: "🔄",
//                 style: {
//                   background: "#3b82f6",
//                   color: "#fff",
//                 },
//               },
//             );
//           }
//         },
//       )
//       .subscribe((status) => {
//         console.log("Admin realtime subscription status:", status);
//         setIsConnected(status === "SUBSCRIBED");
//       });

//     subscriptionRef.current = subscription;
//     isSubscribedRef.current = true;

//     return () => {
//       if (subscriptionRef.current) {
//         subscriptionRef.current.unsubscribe();
//         subscriptionRef.current = null;
//       }
//       isSubscribedRef.current = false;
//       processedUpdatesRef.current.clear();
//     };
//   }, [isAdmin, userId, loadOrders, updateOrderStatus]);

//   return { isConnected };
// };
