import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { chartsService } from "../../services/ChartsService";
import { ErrorResponse, SaidasMensaisResponse } from "../../types";

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
      queryKey: [resourceKey],
      queryFn: () => chartsService.chartSaidasMensais(),
    });
  };

  return {
    chartSaidasMensais,
  };
}
