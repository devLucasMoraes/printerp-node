import { insumoService } from "../../services/InsumoService";
import { useResourceQuery } from "./useResourceQuery";

export function useInsumoQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "insumo",
    service: insumoService,
  });

  return {
    ...baseQueries,
  };
}
