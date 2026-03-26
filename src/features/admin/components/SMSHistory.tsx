// features/admin/components/SMSHistory.tsx
import React, { useState, useEffect } from "react";
import { sentSMSLog } from "../../orders/api/smsApi";
import { MessageSquare, Phone, Copy, Check } from "lucide-react";

export const SMSHistory: React.FC = () => {
  const [history, setHistory] = useState(sentSMSLog);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Refresh history every 5 seconds
    const interval = setInterval(() => {
      setHistory([...sentSMSLog]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No SMS sent yet</p>
        <p className="text-sm text-gray-400">
          SMS notifications will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">SMS Notifications (Demo Mode)</p>
            <p className="text-xs mt-1">
              In this demo, SMS messages are logged here. In production, these
              would be sent to customers' phones via SMS gateway.
            </p>
          </div>
        </div>
      </div>

      {history.map((sms, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-gray-500">
                  Order #{sms.orderNumber}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    sms.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : sms.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {sms.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2 text-sm">
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{sms.to}</span>
              </div>

              <p className="text-gray-700 text-sm">{sms.message}</p>
            </div>

            <button
              onClick={() => copyToClipboard(sms.message, `${index}`)}
              className="p-1 text-gray-400 hover:text-primary transition-colors"
              title="Copy message"
            >
              {copiedId === `${index}` ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
