import { Unidade } from "../constants/Unidade";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  tokenVersion: number;
  profile: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type CategoriaDto = {
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RequisitanteDto = {
  id: number;
  nome: string;
  fone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ParceiroDto = {
  id: number;
  nome: string;
  fone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SetorDto = {
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsumoDto = {
  id: number;
  descricao: string;
  valorUntMed: number;
  valorUntMedAuto: boolean;
  undEstoque: Unidade;
  estoqueMinimo: number;
  categoria: CategoriaDto;
  createdAt: Date;
  updatedAt: Date;
};

export type RequisicaoEstoqueDto = {
  id: number;
  dataRequisicao: Date;
  ordemProducao: string;
  obs: string | null;
  valorTotal: number;
  requisitante: RequisitanteDto;
  setor: SetorDto;
  armazem: ArmazemDto;
  itens: {
    id: number;
    quantidade: number;
    unidade: Unidade;
    valorUnitario: number;
    insumo: InsumoDto;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type EmprestimoDto = {
  id: number;
  dataEmprestimo: Date;
  previsaoDevolucao: Date | null;
  custoEstimado: number;
  tipo: "ENTRADA" | "SAIDA";
  status: "EM_ABERTO" | "FECHADO";
  obs: string | null;
  parceiro: ParceiroDto;
  armazem: ArmazemDto;
  itens: {
    id: number;
    quantidade: number;
    unidade: Unidade;
    valorUnitario: number;
    insumo: InsumoDto;
    devolucaoItens: {
      id: number;
      quantidade: number;
      unidade: Unidade;
      valorUnitario: number;
      insumo: InsumoDto;
      dataDevolucao: Date;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type ArmazemDto = {
  id: number;
  nome: string;
  ativo: boolean;
};

export type EstoqueDto = {
  id: number;
  quantidade: number;
  armazem: ArmazemDto;
  insumo: InsumoDto;
  consumoMedioDiario: number;
  ultimaAtualizacaoConsumo: Date;
  abaixoMinimo: boolean;
  diasRestantes: number;
  previsaoFimEstoque: Date;
  previsaoEstoqueMinimo: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type MovimentoEstoqueDto = {
  id: number;
  armazemDestino: ArmazemDto;
  armazemOrigem: ArmazemDto;
  insumo: InsumoDto;
  tipo: "ENTRADA" | "SAIDA";
  data: Date;
  valorUnitario: number;
  unidade: Unidade;
  documentoOrigem: string;
  tipoDocumento: string;
  regularizado: boolean;
  observacao: string | null;
  userId: string;
  quantidade: number;
  estorno: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Setting = {
  key: string;
  value: string;
  createdDate: Date;
  updatedDate: Date;
  deletedAt?: Date;
};

export type Sort = {
  empty: boolean; // Indica se a ordenação está vazia
  sorted: boolean; // Indica se a ordenação está aplicada
  unsorted: boolean; // Indica se a ordenação não está aplicada
};

export type Pageable = {
  sort: Sort; // Informações sobre a ordenação
  offset: number; // Deslocamento dos resultados
  pageNumber: number; // Número da página atual
  pageSize: number; // Tamanho da página
  paged: boolean; // Indica se a paginação está ativada
  unpaged: boolean; // Indica se a paginação não está ativada
};

export type Page<T> = {
  content: T[]; // Conteúdo da página
  pageable: Pageable; // Informações sobre a paginação
  last: boolean; // Indica se é a última página
  totalPages: number; // Número total de páginas
  totalElements: number; // Número total de elementos
  size: number; // Tamanho da página
  number: number; // Número da página atual
  sort: Sort; // Informações sobre a ordenação
  first: boolean; // Indica se é a primeira página
  numberOfElements: number; // Número de elementos na página atual
  empty: boolean; // Indica se a página está vazia
};

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string | string[];
  filters?: Record<string, any>;
}

export interface ErrorResponse {
  message: string;
}

export type SaidasMensaisResponse = {
  total: number;
  percentual: number;
  seriesData: number[];
  xaxisData: string[];
};

export type InsumosPorSetorResponse = {
  xaxisData: string[];
  series: {
    name: string;
    data: number[];
  }[];
  totalGeral: number;
};
