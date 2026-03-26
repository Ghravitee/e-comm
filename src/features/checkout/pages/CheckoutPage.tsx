/* eslint-disable @typescript-eslint/no-explicit-any */
// features/checkout/pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../cart/store/useCartStore";
import { useOrderStore } from "../../orders/store/useOrderStore";
import { useAuth } from "../../auth/hooks/useAuth";
import { Container } from "../../../shared/components/Container";
import { OrderSummary } from "../components/OrderSummary";
import { AddressForm } from "../components/AddressForm";
import { SavedAddresses } from "../components/SavedAddresses";
import { CheckoutSteps } from "../components/CheckoutSteps";
import { CheckoutSuccess } from "../components/CheckoutSuccess";
import { ShoppingBag, Truck, CreditCard, CheckCircle } from "lucide-react";
import type {
  Address,
  CreateOrderData,
  CreateOrderItemData,
} from "../../orders/types";

type CheckoutStep = "address" | "confirm" | "payment" | "success";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCartStore();
  const { placeOrder, loadAddresses, savedAddresses } = useOrderStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && currentStep !== "success") {
      navigate("/shop");
    }
  }, [items, navigate, currentStep]);

  // Load saved addresses
  useEffect(() => {
    if (user && savedAddresses.length === 0) {
      loadAddresses(user.id);
    }
  }, [user, loadAddresses, savedAddresses.length]);

  const handleAddressSubmit = (
    addressData: Address & { optInSMS?: boolean },
  ) => {
    setShippingAddress(addressData);
    setCurrentStep("confirm");

    // Store SMS preference if needed
    if (addressData.optInSMS) {
      console.log("Customer opted in for SMS updates");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !shippingAddress) return;

    setIsProcessing(true);

    try {
      // Type-safe order data
      const orderData: CreateOrderData = {
        shipping_address: shippingAddress,
        payment_method: "cash_on_delivery",
        subtotal: total(),
        shipping_fee: 0,
        tax: 0,
        discount: 0,
        total: total(),
        notes: `Order placed via web. Payment: Cash on Delivery`,
        // billing_address is optional, so we can omit it
      };

      // Type-safe order items
      const orderItems: CreateOrderItemData[] = items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_image: item.image,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const order = await placeOrder(user.id, orderData, orderItems);

      // Clear cart after successful order
      clearCart();

      setOrderComplete(order);
      setCurrentStep("success");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate steps
  const steps = [
    { id: "address", label: "Shipping", icon: Truck },
    { id: "confirm", label: "Confirm Order", icon: ShoppingBag },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "success", label: "Success", icon: CheckCircle },
  ];

  if (currentStep === "success" && orderComplete) {
    return (
      <CheckoutSuccess
        order={orderComplete}
        onContinue={() => navigate("/orders")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Steps Indicator */}
        <div className="mb-8">
          <CheckoutSteps steps={steps} currentStep={currentStep} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {currentStep === "address" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Address
                  </h2>

                  {/* Saved Addresses Toggle */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useSavedAddress}
                          onChange={(e) => setUseSavedAddress(e.target.checked)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          Use saved address
                        </span>
                      </label>
                    </div>
                  )}

                  {useSavedAddress && savedAddresses.length > 0 ? (
                    <SavedAddresses
                      addresses={savedAddresses}
                      onSelect={setShippingAddress}
                      selectedAddress={shippingAddress}
                    />
                  ) : (
                    <AddressForm
                      onSubmit={handleAddressSubmit}
                      initialData={shippingAddress}
                    />
                  )}
                </div>
              )}

              {currentStep === "confirm" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Confirm Your Order
                  </h2>

                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{shippingAddress.full_name}</p>
                        <p>{shippingAddress.phone}</p>
                        <p>{shippingAddress.address_line1}</p>
                        {shippingAddress.address_line2 && (
                          <p>{shippingAddress.address_line2}</p>
                        )}
                        <p>
                          {shippingAddress.city}, {shippingAddress.state}
                        </p>
                        <p>{shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-green-600">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Pay when your order arrives. You can pay with cash or
                          card at delivery.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCurrentStep("address")}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
                      >
                        {isProcessing ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} total={total()} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
