import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AdjustEstoqueDTO } from "../../schemas/estoque.schema";
import { estoqueService } from "../../services/EstoqueService";
import { ErrorResponse, EstoqueDto, Page, PageParams } from "../../types";

const resourceKey = "ESTOQUE-KEY";
export function useEstoqueQueries() {
  const queryClient = useQueryClient();
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

  const useAdjustEstoque = (
    mutationOptions?: Omit<
      UseMutationOptions<
        EstoqueDto,
        AxiosError<ErrorResponse>,
        { id: number; data: AdjustEstoqueDTO }
      >,
      "mutationFn"
    >
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, data }) => estoqueService.adjust(id, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] });

        mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context);
      },
    });
  };

  return {
    useGetAllPaginated,
    useAdjustEstoque,
  };
}
