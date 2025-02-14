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

export type EquipamentoDto = {
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
  equipamento: EquipamentoDto;
  itens: {
    id: number;
    quantidade: number;
    undEstoque: Unidade;
    valorUnitario: number;
    insumo: InsumoDto;
  }[];
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
}

export interface ErrorResponse {
  message: string;
}
