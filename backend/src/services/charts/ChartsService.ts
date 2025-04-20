import {
  ChartsService,
  InsumosPorSetorResponse,
  SaidasMensaisResponse,
} from "../../domain/services/ChartsService";
import { chartInsumosPorSetorUseCase } from "../../domain/useCases/charts/ChartInsumosPorSetorUseCase";
import { chartSaidasMensaisUseCase } from "../../domain/useCases/charts/ChartSaidasMensaisUseCase";

export class ChartsServiceImpl implements ChartsService {
  async chartInsumosPorSetor(
    periodo: number
  ): Promise<InsumosPorSetorResponse> {
    return await chartInsumosPorSetorUseCase.execute(periodo);
  }
  async chartSaidasMensais(): Promise<SaidasMensaisResponse> {
    return await chartSaidasMensaisUseCase.execute();
  }
}
