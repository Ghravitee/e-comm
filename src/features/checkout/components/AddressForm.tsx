// features/checkout/components/AddressForm.tsx
import React, { useState } from "react";
import type { Address } from "../../orders/types";

interface AddressFormProps {
  onSubmit: (address: Address & { optInSMS?: boolean }) => void;
  initialData?: Address | null;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Address>({
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
    address_line1: initialData?.address_line1 || "",
    address_line2: initialData?.address_line2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postal_code: initialData?.postal_code || "",
    country: initialData?.country || "Nigeria",
  });

  const [optInSMS, setOptInSMS] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>(
    {},
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {};

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address_line1.trim())
      newErrors.address_line1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // Phone number validation (Nigerian numbers)
    if (formData.phone && !/^[\d\s+()-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        optInSMS, // Include SMS preference
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof Address]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="John Doe"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (for SMS updates){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="08012345678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            We'll send order updates via SMS to this number
          </p>
        </div>
      </div>
      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={optInSMS}
            onChange={(e) => setOptInSMS(e.target.checked)}
            className="text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">
            Receive order updates via SMS (recommended)
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          We'll send you tracking updates and delivery notifications
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address_line1"
          value={formData.address_line1}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.address_line1 ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="123 Main Street"
        />
        {errors.address_line1 && (
          <p className="mt-1 text-sm text-red-500">{errors.address_line1}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          name="address_line2"
          value={formData.address_line2}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Apartment, suite, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Lagos"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Lagos"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code (Optional)
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="100001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nigeria"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-500">{errors.country}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/80 transition-colors font-medium"
      >
        Continue to Confirmation
      </button>
    </form>
  );
};
