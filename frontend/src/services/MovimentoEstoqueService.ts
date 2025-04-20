import { MovimentoEstoqueDto, Page, PageParams } from "../types";
import { api } from "./api/axios";

class MovimentoEstoqueService {
  async getAllPaginated({
    page = 0,
    size = 5,
    sort,
    filters,
  }: PageParams = {}) {
    const response = await api.get<Page<MovimentoEstoqueDto>>(
      "/movimentacoes-estoque",
      {
        params: { page, size, sort, ...filters },
      }
    );
    return response.data;
  }
}

export const movimentoEstoqueService = new MovimentoEstoqueService();
