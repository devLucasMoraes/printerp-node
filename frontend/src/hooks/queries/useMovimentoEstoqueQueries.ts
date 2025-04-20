import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { movimentoEstoqueService } from "../../services/MovimentoEstoqueService";
import {
  ErrorResponse,
  MovimentoEstoqueDto,
  Page,
  PageParams,
} from "../../types";

const resourceKey = "movimento-estoque";
export function useMovimentoEstoqueQueries() {
  const useGetAllPaginated = (
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<Page<MovimentoEstoqueDto>, AxiosError<ErrorResponse>>,
      "queryKey" | "queryFn"
    >
  ) => {
    const { page = 0, size = 20, sort, filters = {} } = params;

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, "paginated", page, size, sort, filters],
      queryFn: () =>
        movimentoEstoqueService.getAllPaginated({ page, size, sort, filters }),
    });
  };

  return {
    useGetAllPaginated,
  };
}
