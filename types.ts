export interface FormData {
  tipo_evento: string;
  convidados: string;
  brinde?: string;
  convidados_obs?: string;
  data_casamento?: string;
  duvidas?: string;
}

export interface BudgetItem {
  item: string;
  descricao: string;
  custo_estimado: string;
}

export interface BudgetResult {
  introducao: string;
  categorias: {
    categoria: string;
    itens: BudgetItem[];
  }[];
  total_estimado: string;
  observacoes: string;
}

export interface Step {
  id: number;
  question: string;
  key: string;
  options?: string[];
  type: 'radio' | 'text' | 'info' | 'date' | 'textarea';
  optional?: boolean;
  observationPlaceholder?: string;
  observationKey?: string;
  infoTitle?: string;
  infoItems?: string[];
}