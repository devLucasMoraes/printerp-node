import { ChartsService } from "../../domain/services/ChartsService";
import { chartSaidasMensaisUseCase } from "../../domain/useCases/charts/ChartSaidasMensaisUseCase";

export class ChartsServiceImpl implements ChartsService {
  async chartSaidasMensais(): Promise<any> {
    return await chartSaidasMensaisUseCase.execute();
  }
}
