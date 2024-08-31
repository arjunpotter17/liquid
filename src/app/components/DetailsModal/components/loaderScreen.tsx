import React from "react";

// Icons
// import { SpinnerIcon } from "@/app/Icons/SpinnerIcon"; // Placeholder icon component, replace with actual spinner icon
// import { CheckIcon } from "@/app/Icons/CheckIcon"; // Placeholder icon component, replace with actual check icon

interface ProcessLoadingProps {
  stepStatus: {
    awaitingSignatures: boolean;
    awaitingSale: boolean;
    awaitingSwap: boolean;
  };
}

const ProcessLoading: React.FC<ProcessLoadingProps> = ({ stepStatus }) => {
  const steps = [
    { label: "Awaiting signatures", status: stepStatus.awaitingSignatures },
    { label: "Awaiting sale", status: stepStatus.awaitingSale },
    { label: "Awaiting swap", status: stepStatus.awaitingSwap },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Processing Steps</h2>
      <ul className="list-none p-0">
        {steps.map((step, index) => (
          <li key={index} className="flex items-center mb-4">
            {/* <div className="flex items-center">
              {step.status ? (
                <CheckIcon className="text-green-500 w-5 h-5 mr-2" />
              ) : (
                <SpinnerIcon className="animate-spin text-gray-500 w-5 h-5 mr-2" />
              )}
              <span className={step.status ? "text-gray-800" : "text-gray-500"}>
                {step.label}
              </span>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessLoading;
