import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { chartsService } from "../../services/ChartsService";
import {
  ErrorResponse,
  InsumosPorSetorResponse,
  SaidasMensaisResponse,
} from "../../types";

const resourceKey = "charts";
export function useChartsQueries() {
  const chartSaidasMensais = (
    queryOptions?: Omit<
      UseQueryOptions<SaidasMensaisResponse, AxiosError<ErrorResponse>>,
      "queryKey" | "queryFn"
    >
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, "saidas-mensais"],
      queryFn: () => chartsService.chartSaidasMensais(),
    });
  };

  const chartInsumosPorSetor = (
    periodo: string,
    queryOptions?: Omit<
      UseQueryOptions<InsumosPorSetorResponse, AxiosError<ErrorResponse>>,
      "queryKey" | "queryFn"
    >
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, "insumos-por-setor", periodo],
      queryFn: () => chartsService.chartInsumosPorSetor(periodo),
    });
  };

  return {
    chartSaidasMensais,
    chartInsumosPorSetor,
  };
}
