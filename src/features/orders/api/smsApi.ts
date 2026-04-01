// features/orders/api/smsApi.ts

// Track sent SMS with timestamp and count
export const sentSMSLog: Map<string, { timestamp: number; count: number }> =
  new Map();

// Status message templates
const statusMessages = {
  pending: (orderNumber: string, customerName: string) =>
    `📦 GreenCart: Order #${orderNumber} has been received and is pending confirmation. We'll notify you when it's processing. Thank you, ${customerName}!`,

  processing: (orderNumber: string) =>
    `🔄 GreenCart: Order #${orderNumber} is now being processed. We're preparing your items for shipment.`,

  confirmed: (orderNumber: string) =>
    `✅ GreenCart: Order #${orderNumber} has been confirmed! Your order is ready and will be shipped soon.`,

  shipped: (orderNumber: string) =>
    `🚚 GreenCart: Great news! Order #${orderNumber} has been shipped and is on its way to you.`,

  delivered: (orderNumber: string) =>
    `🎉 GreenCart: Order #${orderNumber} has been delivered! We hope you love your purchase. Please leave a review!`,

  cancelled: (orderNumber: string) =>
    `❌ GreenCart: Order #${orderNumber} has been cancelled. If this was a mistake, please contact support.`,
};

export const sendOrderStatusSMS = async (params: {
  to: string;
  orderNumber: string;
  status: string;
  customerName: string;
}): Promise<boolean> => {
  const { to, orderNumber, status, customerName } = params;

  // Create a unique key for this SMS
  const smsKey = `${orderNumber}-${status}`;
  const now = Date.now();
  const lastEntry = sentSMSLog.get(smsKey);

  // Prevent sending the same status SMS more than once per 30 seconds
  if (lastEntry) {
    const timeSinceLast = now - lastEntry.timestamp;
    if (timeSinceLast < 30000) {
      console.log(
        `Skipping duplicate SMS for ${smsKey} - sent ${timeSinceLast}ms ago`,
      );
      return false;
    }
  }

  // Store that we're sending this SMS
  sentSMSLog.set(smsKey, {
    timestamp: now,
    count: (lastEntry?.count || 0) + 1,
  });

  // Clean old entries after 1 minute
  setTimeout(() => {
    sentSMSLog.delete(smsKey);
  }, 60000);

  const message =
    statusMessages[status as keyof typeof statusMessages]?.(
      orderNumber,
      customerName,
    ) ||
    `GreenCart: Your order #${orderNumber} status has been updated to ${status}.`;

  console.log("📱 SMS Notification:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`To: ${to}`);
  console.log(`Order: #${orderNumber}`);
  console.log(`Status: ${status.toUpperCase()}`);
  console.log(`Message: ${message}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return true;
};
