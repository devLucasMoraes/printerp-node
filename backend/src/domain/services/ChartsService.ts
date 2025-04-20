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

export interface ChartsService {
  chartSaidasMensais(): Promise<SaidasMensaisResponse>;
  chartInsumosPorSetor(periodo: number): Promise<InsumosPorSetorResponse>;
}
