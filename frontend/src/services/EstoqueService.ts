import { AdjustEstoqueDTO } from "../schemas/estoque.schema";
import { EstoqueDto, Page, PageParams } from "../types";
import { api } from "./api/axios";

class EstoqueService {
  async getAllPaginated({
    page = 0,
    size = 20,
    sort,
    filters,
  }: PageParams = {}) {
    const response = await api.get<Page<EstoqueDto>>("/estoques", {
      params: { page, size, sort, ...filters },
    });
    return response.data;
  }
  async adjust(id: number, dto: AdjustEstoqueDTO): Promise<EstoqueDto> {
    const response = await api.put<EstoqueDto>(`/estoques/adjust/${id}`, dto);
    return response.data;
  }
}

export const estoqueService = new EstoqueService();
