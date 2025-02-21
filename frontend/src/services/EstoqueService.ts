import { EstoqueDto, Page, PageParams } from "../types";
import { api } from "./api/axios";

class EstoqueService {
  async getAllPaginated({ page = 0, size = 20, sort }: PageParams = {}) {
    const response = await api.get<Page<EstoqueDto>>("/estoques", {
      params: { page, size, sort },
    });
    return response.data;
  }
}

export const estoqueService = new EstoqueService();
