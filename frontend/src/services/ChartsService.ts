import { InsumosPorSetorResponse, SaidasMensaisResponse } from "../types";
import { api } from "./api/axios";

class ChartsService {
  async chartSaidasMensais() {
    const response = await api.get<SaidasMensaisResponse>(
      "/charts/saidas-mensais"
    );
    return response.data;
  }

  async chartInsumosPorSetor(periodo: string) {
    const response = await api.get<InsumosPorSetorResponse>(
      `/charts/insumos-por-setor/${periodo}`
    );
    return response.data;
  }
}

export const chartsService = new ChartsService();
