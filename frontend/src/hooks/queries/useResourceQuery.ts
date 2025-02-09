import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CrudService } from "../../services/CrudService";
import { ErrorResponse, Page, PageParams } from "../../types";

export interface QueryHookOptions<ID, T> {
  resourceKey: string;
  service: CrudService<ID, T>;
}

export function useResourceQuery<ID, T>(options: QueryHookOptions<ID, T>) {
  const { resourceKey, service } = options;
  const queryClient = useQueryClient();

  const useGetById = (
    id: ID,
    queryOptions?: Omit<
      UseQueryOptions<T, AxiosError<ErrorResponse>>,
      "queryKey" | "queryFn"
    >
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, id],
      queryFn: () => service.getById(id),
    });
  };

  const useGetAll = (
    queryOptions?: Omit<
      UseQueryOptions<T[], AxiosError<ErrorResponse>>,
      "queryKey" | "queryFn"
    >
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey],
      queryFn: () => service.getAll(),
    });
  };

  const useGetAllPaginated = (
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<Page<T>, AxiosError<ErrorResponse>>,
      "queryKey" | "queryFn"
    >
  ) => {
    const { page = 0, size = 20, sort } = params;

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, "paginated", page, size, sort],
      queryFn: () => service.getAllPaginated({ page, size, sort }),
    });
  };

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<T, AxiosError<ErrorResponse>, T>,
      "mutationFn"
    >
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: (data: T) => service.create(data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] });

        mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context);
      },
    });
  };

  const useUpdate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        T,
        AxiosError<ErrorResponse>,
        { id: ID; data: Partial<T> }
      >,
      "mutationFn"
    >
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, data }) => service.update(id, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] });

        mutationOptions?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context);
      },
    });
  };

  const useDelete = (
    mutationOptions?: Omit<
      UseMutationOptions<void, AxiosError<ErrorResponse>, ID>,
      "mutationFn"
    >
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: (id: ID) => service.delete(id),
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
    useGetById,
    useGetAllPaginated,
    useGetAll,
    useCreate,
    useUpdate,
    useDelete,
  };
}
