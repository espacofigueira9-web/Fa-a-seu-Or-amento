import React, { useState, useEffect } from 'react';
import { STEPS } from './constants';
import { FormData } from './types';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import StepComponent from './components/StepComponent';
import ResultComponent from './components/ResultComponent';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    tipo_evento: '',
    convidados: '',
    brinde: '',
    convidados_obs: '',
    data_casamento: '',
    duvidas: '',
  });
  const [isFinished, setIsFinished] = useState(false);

  // This effect clears irrelevant data if the user goes back and changes the event type.
  useEffect(() => {
    if (formData.tipo_evento === 'Somente locação do espaço') {
      setFormData(prev => ({
        ...prev,
        convidados: '',
        convidados_obs: '',
        brinde: '',
        duvidas: '',
      }));
    }
  }, [formData.tipo_evento]);

  const getVisibleSteps = () => {
    const initialStep = STEPS.find(step => step.key === 'tipo_evento');
    const dateStep = STEPS.find(step => step.key === 'data_casamento');
    if (!initialStep) return [];

    if (formData.tipo_evento === 'Pacote completo') {
      return [
        initialStep,
        STEPS.find(step => step.key === 'convidados'),
        STEPS.find(step => step.key === 'pacote_incluso'),
        STEPS.find(step => step.key === 'brinde'),
        STEPS.find(step => step.key === 'duvidas'),
        dateStep,
      ].filter(Boolean) as any;
    }
    
    if (formData.tipo_evento === 'Somente locação do espaço') {
      return [
        initialStep,
        STEPS.find(step => step.key === 'locacao_info'),
        dateStep,
      ].filter(Boolean) as any;
    }
    
    return [initialStep]; // Only show the first step initially
  };

  const visibleSteps = getVisibleSteps();

  useEffect(() => {
    // If a user changes from 'Pacote completo' back to 'Locação',
    // steps disappear. This ensures the currentStep index doesn't become invalid.
    if (currentStep >= visibleSteps.length) {
      setCurrentStep(visibleSteps.length - 1);
    }
  }, [formData.tipo_evento, currentStep, visibleSteps.length]);


  const handleUpdate = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (isFinished) {
        setIsFinished(false);
        setFormData(prev => ({ ...prev, convidados_obs: '' })); // Clear observation on going back
        setCurrentStep(visibleSteps.length - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const currentStepData = visibleSteps[currentStep];
  let isCurrentStepValid = false; // Default to false
    if (!currentStepData) {
      isCurrentStepValid = false;
    } else if (currentStepData.type === 'info' || currentStepData.optional) {
        isCurrentStepValid = true; // Info and optional steps are always valid
    } else if (currentStepData.key === 'convidados') {
        isCurrentStepValid = (formData.convidados?.trim() !== '') || (formData.convidados_obs?.trim() !== '');
    } else {
        isCurrentStepValid = (formData[currentStepData.key as keyof FormData] ?? '').trim() !== '';
    }


  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/5 p-6 sm:p-10 space-y-8">
        <Header />
        
        {!isFinished ? (
            <>
                <ProgressBar currentStep={currentStep} totalSteps={visibleSteps.length} />
                <div className="pt-4">
                     {currentStepData && <StepComponent
                        step={currentStepData}
                        formData={formData}
                        onUpdate={handleUpdate}
                    />}
                </div>
                <div className="flex justify-between items-center pt-6">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="px-6 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!isCurrentStepValid}
                        className="px-6 py-2 text-white bg-[#026842] rounded-lg hover:bg-[#014D31] disabled:bg-green-900/50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                        {currentStep === visibleSteps.length - 1 ? 'Gerar Orçamento' : 'Próximo'}
                    </button>
                </div>
            </>
        ) : (
            <ResultComponent formData={formData} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default App;