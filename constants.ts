import { Step } from './types';

export const STEPS: Step[] = [
  {
    id: 1,
    question: "O que vocês procuram?",
    key: "tipo_evento",
    options: ["Pacote completo", "Somente locação do espaço"],
    type: 'radio',
  },
  {
    id: 2,
    question: "Quantos convidados vocês planejam?",
    key: "convidados",
    options: ["50 convidados", "70 convidados", "100 convidados", "150 convidados"],
    type: 'radio',
    observationPlaceholder: "Seu número de convidados é diferente? Informe aqui para um orçamento personalizado via WhatsApp.",
    observationKey: "convidados_obs",
  },
  {
    id: 3,
    question: "", // Not used for info type
    key: "pacote_incluso",
    type: 'info',
    infoTitle: "Serviços que você já tem direito no Pacote Completo:",
    infoItems: [
        "Buffet completo Selma Ribeiro",
        "Decoração personalizada",
        "DJ",
        "Cerimonial completo",
        "Pista de dança",
        "Equipe operacional completa"
    ]
  },
  {
    id: 4,
    question: "Como brinde, o que você prefere?",
    key: "brinde",
    options: ["Penteado da Noiva", "Buquê da Noiva"],
    type: 'radio',
  },
  {
    id: 5,
    question: "", // Not used for info type
    key: "locacao_info",
    type: 'info',
    infoTitle: "Detalhes da Locação do Espaço",
    infoItems: [
        "Capacidade para até 170 convidados",
        "Salão",
        "Local para Cerimônia",
        "Limpeza",
        "Segurança",
        "Manobristas",
        "Suporte operacional"
    ]
  },
  {
    id: 6,
    question: "Qual é a data desejada para o casamento?",
    key: "data_casamento",
    type: 'date',
  },
  {
    id: 7,
    question: "Você tem alguma dúvida ou pedido especial? (Opcional)",
    key: "duvidas",
    type: 'textarea',
    optional: true,
  },
];