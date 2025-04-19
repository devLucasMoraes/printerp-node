import { RequestHandler } from "express";
import { ChartsService } from "../../domain/services/ChartsService";
import { ChartsServiceImpl } from "../../services/charts/ChartsService";

export class ChartsController {
  constructor(private readonly chartService: ChartsService) {}

  chartSaidasMensais: RequestHandler = async (req, res) => {
    const result = await this.chartService.chartSaidasMensais();

    res.status(200).json(result);
  };
}

export const chartsController = new ChartsController(new ChartsServiceImpl());
