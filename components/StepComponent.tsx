import React from 'react';
import { Step, FormData } from '../types';

interface StepComponentProps {
  step: Step;
  formData: FormData;
  onUpdate: (key: keyof FormData, value: string) => void;
}

const StepComponent: React.FC<StepComponentProps> = ({ step, formData, onUpdate }) => {
  
  const handleOptionChange = (option: string) => {
    // Select a radio, clear the observation text
    if (step.observationKey) {
        onUpdate(step.observationKey as keyof FormData, '');
    }
    onUpdate(step.key as keyof FormData, option);
  };

  const handleObservationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Type in observation text, clear the radio selection
    onUpdate(step.key as keyof FormData, '');
    if (step.observationKey) {
        onUpdate(step.observationKey as keyof FormData, e.target.value);
    }
  };

  const selectedValue = formData[step.key as keyof FormData] ?? '';
  const observationValue = step.observationKey ? formData[step.observationKey as keyof FormData] : '';
  
  if (step.type === 'info') {
    return (
      <div className="animate-fade-in text-center p-4">
        <h3 className="text-2xl font-semibold text-gray-800">{step.infoTitle}</h3>
        <ul className="mt-6 space-y-3 text-left w-fit mx-auto list-none p-0">
          {step.infoItems?.map((item) => (
            <li key={item} className="flex items-center text-lg text-gray-700">
              <svg className="w-6 h-6 text-[#026842] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  if (step.type === 'date') {
    return (
        <div className="animate-fade-in">
            <h3 className="text-2xl font-semibold text-gray-800 text-center">{step.question}</h3>
            <div className="mt-6 flex justify-center">
                <input
                    type="date"
                    value={selectedValue}
                    onChange={(e) => onUpdate(step.key as keyof FormData, e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Disable past dates
                    className="p-3 border-2 border-gray-200 rounded-lg focus:ring-[#026842] focus:border-[#026842] transition-colors w-full max-w-xs text-lg"
                />
            </div>
        </div>
    );
  }

  if (step.type === 'textarea') {
    return (
      <div className="animate-fade-in">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">{step.question}</h3>
        <div className="mt-6">
          <textarea
            value={selectedValue}
            onChange={(e) => onUpdate(step.key as keyof FormData, e.target.value)}
            placeholder="Escreva aqui suas perguntas..."
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-[#026842] focus:border-[#026842] transition-colors"
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-semibold text-gray-800 text-center">{step.question}</h3>
      <div className="mt-6 space-y-4">
        {step.options?.map((option) => (
          <label
            key={option}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedValue === option ? 'bg-green-50 border-[#026842] shadow-md' : 'border-gray-200 hover:border-[#026842]/50'
            }`}
          >
            <input
              type="radio"
              name={step.key}
              value={option}
              checked={selectedValue === option}
              onChange={() => handleOptionChange(option)}
              className="hidden"
            />
            <span className="text-lg text-gray-700">{option}</span>
          </label>
        ))}
        
        {step.observationPlaceholder && step.observationKey && (
          <div className="pt-2">
            <textarea
              value={observationValue}
              onChange={handleObservationChange}
              placeholder={step.observationPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#026842] focus:border-[#026842] transition-colors"
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepComponent;