import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router";
import { estoqueService } from "../../services/EstoqueService";
import { EstoqueDto, Page, PageParams } from "../../types";

const resourceKey = "ESTOQUE-KEY";

export function useEstoqueQueries() {
  const useGetAllPaginated = (
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<Page<EstoqueDto>, AxiosError<ErrorResponse>>,
      "queryKey" | "queryFn"
    >
  ) => {
    const { page = 0, size = 20, sort } = params;

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, "paginated", page, size, sort],
      queryFn: () => estoqueService.getAllPaginated({ page, size, sort }),
    });
  };

  return {
    useGetAllPaginated,
  };
}
