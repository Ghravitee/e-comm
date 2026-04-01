// // features/orders/hooks/useRealtimeOrders.ts
// import { useEffect, useState, useRef } from "react";
// import { supabase } from "../../../services/supabase/client";
// import { useOrderStore } from "../store/useOrderStore";
// import type { OrderWithItems } from "../types";
// import toast from "react-hot-toast";

// export const useRealtimeOrders = (userId: string | undefined) => {
//   const { updateOrderStatus, loadOrders } = useOrderStore();
//   const [isConnected, setIsConnected] = useState(false);

//   // Refs to prevent multiple subscriptions and duplicate processing
//   const ordersSubscriptionRef = useRef<any>(null);
//   const newOrdersSubscriptionRef = useRef<any>(null);
//   const isSubscribedRef = useRef(false);
//   const processedUpdatesRef = useRef<Set<string>>(new Set());
//   const processingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

//   // Clear processed update after a delay
//   const clearProcessedUpdate = (orderId: string) => {
//     if (processingTimeoutRef.current.has(orderId)) {
//       clearTimeout(processingTimeoutRef.current.get(orderId));
//       processingTimeoutRef.current.delete(orderId);
//     }
//     processedUpdatesRef.current.delete(orderId);
//   };

//   useEffect(() => {
//     if (!userId) return;

//     // Prevent multiple subscriptions
//     if (isSubscribedRef.current) return;

//     // First, load initial orders (force refresh)
//     loadOrders(userId, false, true);

//     // Create stable channel names
//     const updateChannelName = `orders-updates-${userId}`;
//     const insertChannelName = `new-orders-${userId}`;

//     // Subscribe to UPDATE changes on orders table
//     const ordersSubscription = supabase
//       .channel(updateChannelName)
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "orders",
//           filter: `user_id=eq.${userId}`,
//         },
//         async (payload) => {
//           const updatedOrder = payload.new as OrderWithItems;
//           const orderId = updatedOrder.id;

//           // Deduplicate: skip if we've already processed this update recently
//           if (processedUpdatesRef.current.has(orderId)) {
//             console.log("Skipping duplicate update for order:", orderId);
//             return;
//           }

//           // Mark as processed
//           processedUpdatesRef.current.add(orderId);

//           // Clear after 2 seconds to allow future updates
//           if (processingTimeoutRef.current.has(orderId)) {
//             clearTimeout(processingTimeoutRef.current.get(orderId));
//           }
//           processingTimeoutRef.current.set(
//             orderId,
//             setTimeout(() => {
//               clearProcessedUpdate(orderId);
//             }, 2000),
//           );

//           console.log(
//             "Processing order update for:",
//             orderId,
//             updatedOrder.status,
//           );

//           // Get the old order from store before updating
//           const currentOrders = useOrderStore.getState().orders;
//           const oldOrder = currentOrders.find((o) => o.id === orderId);

//           // Update the order status in the store (this will trigger SMS)
//           await updateOrderStatus(
//             updatedOrder.id,
//             userId,
//             updatedOrder.status,
//             false,
//           );

//           // Show a toast notification for status changes (but don't duplicate)
//           if (oldOrder && oldOrder.status !== updatedOrder.status) {
//             toast.success(
//               `Order #${updatedOrder.order_number} status updated to ${updatedOrder.status}!`,
//               {
//                 duration: 4000,
//                 position: "top-right",
//                 id: `order-status-${orderId}`, // Use custom ID to prevent duplicate toasts
//               },
//             );
//           }
//         },
//       )
//       .subscribe((status) => {
//         console.log("Realtime subscription status:", status);
//         setIsConnected(status === "SUBSCRIBED");
//       });

//     // Subscribe to INSERT changes on orders table
//     const newOrdersSubscription = supabase
//       .channel(insertChannelName)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "orders",
//           filter: `user_id=eq.${userId}`,
//         },
//         async (payload) => {
//           const newOrder = payload.new as OrderWithItems;
//           const orderId = newOrder.id;

//           // Deduplicate new order notifications
//           if (processedUpdatesRef.current.has(orderId)) {
//             console.log("Skipping duplicate new order:", orderId);
//             return;
//           }

//           processedUpdatesRef.current.add(orderId);
//           setTimeout(() => clearProcessedUpdate(orderId), 2000);

//           console.log("New order received:", newOrder);

//           // Refresh all orders to get the new one (force refresh)
//           await loadOrders(userId, false, true);

//           toast.success(`New order #${newOrder.order_number} created!`, {
//             duration: 4000,
//             position: "top-right",
//             id: `new-order-${orderId}`,
//           });
//         },
//       )
//       .subscribe();

//     // Store subscriptions in refs
//     ordersSubscriptionRef.current = ordersSubscription;
//     newOrdersSubscriptionRef.current = newOrdersSubscription;
//     isSubscribedRef.current = true;

//     // Cleanup subscriptions on unmount
//     return () => {
//       if (ordersSubscriptionRef.current) {
//         ordersSubscriptionRef.current.unsubscribe();
//         ordersSubscriptionRef.current = null;
//       }
//       if (newOrdersSubscriptionRef.current) {
//         newOrdersSubscriptionRef.current.unsubscribe();
//         newOrdersSubscriptionRef.current = null;
//       }
//       isSubscribedRef.current = false;

//       // Clear all timeouts
//       processingTimeoutRef.current.forEach((timeout) => {
//         clearTimeout(timeout);
//       });
//       processingTimeoutRef.current.clear();
//       processedUpdatesRef.current.clear();
//     };
//   }, [userId, loadOrders, updateOrderStatus]);

//   return { isConnected };
// };
