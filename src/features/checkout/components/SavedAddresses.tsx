// features/checkout/components/SavedAddresses.tsx
import React from "react";
import type { SavedAddress, Address } from "../../orders/types";
import { Check, MapPin, Trash2, Edit2 } from "lucide-react";

interface SavedAddressesProps {
  addresses: SavedAddress[];
  onSelect: (address: Address) => void;
  selectedAddress: Address | null;
  onEdit?: (address: SavedAddress) => void;
  onDelete?: (addressId: string) => void;
}

export const SavedAddresses: React.FC<SavedAddressesProps> = ({
  addresses,
  onSelect,
  selectedAddress,
  onEdit,
  onDelete,
}) => {
  const isAddressSelected = (address: SavedAddress): boolean => {
    if (!selectedAddress) return false;
    return (
      address.full_name === selectedAddress.full_name &&
      address.address_line1 === selectedAddress.address_line1 &&
      address.city === selectedAddress.city
    );
  };

  const convertToAddress = (saved: SavedAddress): Address => ({
    full_name: saved.full_name,
    phone: saved.phone,
    address_line1: saved.address_line1,
    address_line2: saved.address_line2,
    city: saved.city,
    state: saved.state,
    postal_code: saved.postal_code,
    country: saved.country,
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-2">Select a saved address:</p>

      {addresses.map((address) => (
        <div
          key={address.id}
          className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
            isAddressSelected(address)
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary/50"
          }`}
          onClick={() => onSelect(convertToAddress(address))}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <MapPin
                className={`w-5 h-5 ${isAddressSelected(address) ? "text-primary" : "text-gray-400"}`}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{address.full_name}</p>
                {address.is_default && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
              <p className="text-sm text-gray-600 mt-1">
                {address.address_line1}
                {address.address_line2 && `, ${address.address_line2}`}
                <br />
                {address.city}, {address.state} {address.postal_code}
                <br />
                {address.country}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isAddressSelected(address) && (
                <Check className="w-5 h-5 text-primary" />
              )}

              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(address);
                  }}
                  className="p-1 text-gray-400 hover:text-primary transition-colors"
                  aria-label="Edit address"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}

              {onDelete && !address.is_default && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(address.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() =>
          onSelect({
            full_name: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "Nigeria",
          })
        }
        className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-primary hover:border-primary transition-colors"
      >
        + Use a different address
      </button>
    </div>
  );
};
