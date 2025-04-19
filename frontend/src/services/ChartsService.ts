import { SaidasMensaisResponse } from "../types";
import { api } from "./api/axios";

class ChartsService {
  async chartSaidasMensais() {
    const response = await api.get<SaidasMensaisResponse>(
      "/charts/saidas-mensais"
    );
    return response.data;
  }
}

export const chartsService = new ChartsService();
