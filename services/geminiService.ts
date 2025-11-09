import { GoogleGenAI, Type } from "@google/genai";
import { FormData, BudgetResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fixedPrices: { [key: string]: string } = {
  '50 convidados': 'R$ 38.000,00',
  '70 convidados': 'R$ 43.000,00',
  '100 convidados': 'R$ 49.000,00',
  '150 convidados': 'R$ 56.000,00',
};

const includedServices = [
    "Buffet completo Selma Ribeiro",
    "Decoração personalizada",
    "DJ",
    "Cerimonial completo",
    "Pista de dança",
    "Equipe operacional completa"
];

export async function generateBudget(formData: FormData): Promise<BudgetResult> {
  const { tipo_evento, convidados, brinde, data_casamento, duvidas } = formData;

  const fixedPrice = fixedPrices[convidados];
  let detailedInstructions;
  let clientDataPrompt = `
    **Dados do Cliente:**
    - Tipo de Evento: ${tipo_evento}
  `;
   if (data_casamento) {
      clientDataPrompt += `\n    - Data do Casamento: ${data_casamento}`;
   }


  if (tipo_evento === 'Pacote completo' && fixedPrice) {
    clientDataPrompt += `\n    - Número de Convidados: ${convidados}`;
    if (brinde) {
      clientDataPrompt += `\n    - Brinde Escolhido: ${brinde}`;
    }
    if (duvidas) {
      clientDataPrompt += `\n    - Dúvidas do Cliente: ${duvidas}`;
    }

    detailedInstructions = `
    3.  **Itens Detalhados (Pacote Completo):** 
        - Organize os itens em categorias apropriadas (ex: Gastronomia, Música, Estrutura).
        - Liste EXATAMENTE os seguintes serviços: ${includedServices.join(', ')}.
        - Para cada item, a descrição deve ser curta e objetiva.
        - Para cada item listado, o campo "custo_estimado" DEVE ser a string "Direito". NÃO mostre valores individuais para os itens.
        - **IMPORTANTE: NÃO INCLUA** os itens "Bar de Drinks Premium", "Mesa de Doces Finos", "Coquetel de Boas-Vindas" e "Fotógrafo" na lista de serviços.
        - **IMPORTANTE: INCLUA** o item "Bolo de Casamento" com a descrição exata "Bolo de corte".
        - **Brinde:** Se um brinde foi escolhido, inclua-o numa categoria relevante (ex: "Detalhes Especiais") com o custo "Direito". O brinde escolhido foi: "${brinde}".

    4.  **Total do Pacote:**
        - O valor "total_estimado" da proposta DEVE ser EXATAMENTE **${fixedPrice}**. Este é o preço final do pacote.
    `;
  } else if (tipo_evento === 'Somente locação do espaço') {
      detailedInstructions = `
    3.  **Itens Detalhados (Locação do Espaço):** 
        - Crie uma única categoria chamada "Espaço & Estrutura".
        - Dentro dela, liste os seguintes serviços inclusos: Salão, Local para Cerimônia, Limpeza, Segurança, Manobristas e Suporte operacional.
        - Para cada item, a descrição deve ser curta e objetiva.
        - Para cada item listado, o campo "custo_estimado" DEVE ser a string "Direito". NÃO mostre valores individuais para os itens.

    4.  **Total da Locação:**
        - O valor "total_estimado" da proposta DEVE ser EXATAMENTE **R$ 6.000,00**. Este é o preço final da locação.
    `;
  } else {
     // Fallback for any unexpected case
    detailedInstructions = `
    **Instrução de Erro:** Ocorreu um erro inesperado com os dados fornecidos. Gere uma mensagem de erro amigável na 'introducao' pedindo para o usuário voltar e tentar novamente. Deixe as outras seções vazias.
    `;
  }

  let observacoesInstruction = '';
  if (duvidas && duvidas.trim() !== '') {
    observacoesInstruction = `Se o cliente enviou dúvidas (no campo 'Dúvidas do Cliente'), NÃO as responda diretamente na proposta. Em vez disso, adicione uma frase amigável como "Anotamos suas dúvidas e vamos esclarecer todos os pontos em nosso contato via WhatsApp."`;
  }


  const prompt = `
    Crie uma proposta de orçamento de casamento detalhada em português para a "Figueira Eventos".

    ${clientDataPrompt}

    **Instruções para a Proposta:**
    1.  **Introdução:** Escreva um parágrafo caloroso e acolhedor, parabenizando os noivos e apresentando a proposta da Figueira Eventos com base nas escolhas deles. Se for "Somente locação do espaço", mencione que o espaço suporta confortavelmente até 170 convidados.
    2.  **Estrutura do Orçamento:** Organize o orçamento em categorias claras (ex: Espaço & Estrutura, Gastronomia, Decoração, Equipe & Serviços).
    ${detailedInstructions}
    5.  **Observações:** Adicione uma seção final com observações importantes, como "Proposta válida por 30 dias" e um convite para uma reunião. Se for um pacote fechado, mencione isso. ${observacoesInstruction}
    6.  **Formato de Saída:** A resposta DEVE ser um objeto JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      introducao: { type: Type.STRING, description: "Parágrafo introdutório caloroso." },
      categorias: {
        type: Type.ARRAY,
        description: "Lista de categorias do orçamento.",
        items: {
          type: Type.OBJECT,
          properties: {
            categoria: { type: Type.STRING, description: "Nome da categoria (ex: Gastronomia)." },
            itens: {
              type: Type.ARRAY,
              description: "Lista de itens dentro da categoria.",
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING, description: "Nome do item (ex: Buffet Completo)." },
                  descricao: { type: Type.STRING, description: "Breve descrição do item." },
                  custo_estimado: { type: Type.STRING, description: "Custo estimado formatado em Reais (R$) ou 'Direito'." },
                },
                required: ["item", "descricao", "custo_estimado"],
              },
            },
          },
          required: ["categoria", "itens"],
        },
      },
      total_estimado: { type: Type.STRING, description: "Valor total estimado, formatado em Reais (R$)." },
      observacoes: { type: Type.STRING, description: "Observações e próximos passos." },
    },
    required: ["introducao", "categorias", "total_estimado", "observacoes"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as BudgetResult;
  } catch (e) {
    console.error("Error calling or parsing Gemini response:", e);
    // There was a typo in the model name 'gemini-2.čas' which I've corrected to 'gemini-2.5-flash'
    // This might have been the cause of previous errors.
    if (e instanceof Error && e.message.includes("400")) {
        throw new Error("Houve um problema com a sua solicitação. Verifique os dados e tente novamente.");
    }
    throw new Error("Não foi possível gerar o orçamento no momento. Por favor, tente novamente mais tarde.");
  }
}