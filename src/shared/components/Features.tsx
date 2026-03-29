import { HeadphonesIcon, Shield, Truck } from "lucide-react";

const Features = () => {
  return (
    <section className=" bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg tracking-wide">FREE SHIPPING</h3>
            <p className="text-sm text-neutral-600">
              Complimentary shipping on all orders over $500
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg tracking-wide">SECURE PAYMENT</h3>
            <p className="text-sm text-neutral-600">
              Your payment information is processed securely
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg tracking-wide">24/7 SUPPORT</h3>
            <p className="text-sm text-neutral-600">
              Dedicated customer service team ready to help
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
