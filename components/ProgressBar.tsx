
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-[#026842]">Passo {currentStep + 1} de {totalSteps}</span>
      </div>
      <div className="w-full bg-green-900/10 rounded-full h-2.5">
        <div 
          className="bg-[#026842] h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;