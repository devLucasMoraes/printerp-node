export type SaidasMensaisResponse = {
  total: number;
  percentual: number;
  seriesData: number[];
  xaxisData: string[];
};

export interface ChartsService {
  chartSaidasMensais(): Promise<SaidasMensaisResponse>;
}
