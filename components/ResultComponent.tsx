import React, { useState, useEffect } from 'react';
import { FormData, BudgetResult } from '../types';
import { generateBudget } from '../services/geminiService';

interface ResultComponentProps {
  formData: FormData;
  onBack: () => void;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ formData, onBack }) => {
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If there's a custom guest count, we don't fetch a budget.
    if (formData.convidados_obs && formData.convidados_obs.trim() !== '') {
      setLoading(false);
      return;
    }

    const fetchBudget = async () => {
      try {
        setLoading(true);
        setError(null);
        const budget = await generateBudget(formData);
        setResult(budget);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Ocorreu um erro desconhecido.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
  }, [formData]);

  const handleRequestMenu = () => {
    let message = `Olá! Gostaria de receber o cardápio para o meu evento.\n\nMinhas escolhas foram:\n- Tipo de Evento: ${formData.tipo_evento}\n- Número de Convidados: ${formData.convidados}`;
    if (formData.brinde) {
      message += `\n- Brinde Escolhido: ${formData.brinde}`;
    }
    if (formData.duvidas) {
      message += `\n- Minhas Dúvidas: ${formData.duvidas}`;
    }
    if (formData.data_casamento) {
      message += `\n- Data do Evento: ${new Date(formData.data_casamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
    }
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511921691019?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleContactForSpace = () => {
    let message = `Olá! Tenho interesse na locação do espaço.`;
    if (formData.data_casamento) {
      message += `\n\nA data de interesse é: ${new Date(formData.data_casamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
    }
     message += `\n\nGostaria de mais informações.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511921691019?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCustomQuoteRequest = () => {
    let message = `Olá! Gostaria de um orçamento personalizado para um evento com ${formData.convidados_obs} convidados.`;
     if (formData.data_casamento) {
      message += `\n\nA data de interesse é: ${new Date(formData.data_casamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
    }
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511921691019?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Custom Quote Screen
  if (formData.convidados_obs && formData.convidados_obs.trim() !== '') {
    return (
       <div className="animate-fade-in text-center p-6">
        <h2 className="text-3xl font-bold text-[#026842] mb-4">Orçamento Personalizado</h2>
        <p className="text-gray-600 mb-6">
          Para um evento com <strong>{formData.convidados_obs} convidados</strong>, nossa equipe preparará uma proposta especial para você.
        </p>
        <p className="text-gray-600 mb-8">
          Clique no botão abaixo para solicitar seu orçamento diretamente pelo WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            Voltar e Editar
          </button>
          <button
            onClick={handleCustomQuoteRequest}
            className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
            Solicitar Orçamento
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#026842] mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Criando a proposta dos seus sonhos...</p>
        <p className="text-sm text-gray-500">Um momento, por favor.</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-left" role="alert">
          <strong className="font-bold">Oops!</strong>
          <span className="block sm:inline"> Algo deu errado ao gerar seu orçamento.</span>
          <p className="text-sm mt-2">{error}</p>
        </div>
        <div className="text-center pt-6">
            <button
                onClick={onBack}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Voltar e Tentar Novamente
            </button>
        </div>
      </>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="text-left p-2 sm:p-4 bg-white rounded-xl">
        <h2 className="text-3xl font-bold text-[#026842] text-center mb-4">Sua Proposta de Casamento dos Sonhos</h2>
        <p className="text-gray-600 text-center mb-8">{result.introducao}</p>
        
        {result.categorias.map((cat, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-2xl font-semibold text-[#026842] border-b-2 border-green-900/10 pb-2 mb-4">{cat.categoria}</h3>
            <ul className="space-y-4">
              {cat.itens.map((item, itemIndex) => (
                <li key={itemIndex} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{item.item}</p>
                    <p className="text-sm text-gray-500 max-w-md">{item.descricao}</p>
                  </div>
                  <p className="font-medium text-gray-700 text-right min-w-[100px] whitespace-nowrap pl-4">{item.custo_estimado}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 text-center">
           <h3 className="text-xl font-semibold text-gray-700">Total Estimado</h3>
           <p className="text-4xl font-bold text-[#026842] my-2">{result.total_estimado}</p>
        </div>
         <div className="mt-6 p-4 bg-green-900/5 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">Observações Importantes:</p>
          <p className="whitespace-pre-wrap">{result.observacoes}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
          <button
              onClick={onBack}
              className="px-6 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
              Voltar e Editar
          </button>
          {formData.tipo_evento === 'Pacote completo' && (
             <button
              onClick={handleRequestMenu}
              className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Pedir Cardápio via WhatsApp
            </button>
          )}
          {formData.tipo_evento === 'Somente locação do espaço' && (
             <button
              onClick={handleContactForSpace}
              className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Solicitar Contato via WhatsApp
            </button>
          )}
      </div>
    </div>
  );
};

export default ResultComponent;