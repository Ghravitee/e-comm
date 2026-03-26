// features/orders/api/smsApi.ts
// Free SMS simulation for portfolio/demo

interface SMSMessage {
  to: string;
  message: string;
  orderNumber: string;
  status: string;
}

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

// Store sent messages for demo (shows in UI)
export const sentSMSLog: SMSMessage[] = [];

// Send SMS (simulated for portfolio)
export const sendOrderStatusSMS = async (params: {
  to: string;
  orderNumber: string;
  status: string;
  customerName: string;
}): Promise<boolean> => {
  const { to, orderNumber, status, customerName } = params;

  const message =
    statusMessages[status as keyof typeof statusMessages]?.(
      orderNumber,
      customerName,
    ) ||
    `GreenCart: Your order #${orderNumber} status has been updated to ${status}.`;

  // Log to console for development
  console.log("📱 SMS Notification:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`To: ${to}`);
  console.log(`Order: #${orderNumber}`);
  console.log(`Status: ${status.toUpperCase()}`);
  console.log(`Message: ${message}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Store in memory for UI display
  sentSMSLog.unshift({
    to,
    message,
    orderNumber,
    status,
  });

  // Keep only last 50 messages
  if (sentSMSLog.length > 50) sentSMSLog.pop();

  // In a real implementation with Twilio, we would:
  // const twilioClient = require('twilio');
  // await twilioClient.messages.create({
  //   body: message,
  //   to: to,
  //   from: process.env.TWILIO_PHONE_NUMBER
  // });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return true;
};

// Get SMS history (for admin UI)
export const getSMSHistory = () => sentSMSLog;
