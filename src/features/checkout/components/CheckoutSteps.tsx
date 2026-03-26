// features/checkout/components/CheckoutSteps.tsx
import React from "react";
import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface CheckoutStepsProps {
  steps: Step[];
  currentStep: string;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  steps,
  currentStep,
}) => {
  const getStepStatus = (stepId: string, index: number) => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);

    if (stepId === currentStep) return "current";
    if (index < stepIndex) return "completed";
    return "pending";
  };

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id, index);
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-200
                  ${status === "completed" ? "bg-green-500 text-white" : ""}
                  ${status === "current" ? "bg-primary text-white ring-4 ring-primary/20" : ""}
                  ${status === "pending" ? "bg-gray-200 text-gray-500" : ""}
                `}
              >
                {status === "completed" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <p
                className={`
                  mt-2 text-sm font-medium
                  ${status === "completed" ? "text-green-600" : ""}
                  ${status === "current" ? "text-primary" : ""}
                  ${status === "pending" ? "text-gray-400" : ""}
                `}
              >
                {step.label}
              </p>
            </div>

            {!isLast && (
              <div
                className={`
                  flex-1 h-0.5 mx-4
                  ${status === "completed" ? "bg-green-500" : "bg-gray-200"}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
