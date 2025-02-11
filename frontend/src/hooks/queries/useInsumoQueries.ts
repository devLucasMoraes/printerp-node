import { insumoService } from "../../services/InsumoService";
import { useResourceQuery } from "./useResourceQuery";

export function useInsumoQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "INSUMO-KEY",
    service: insumoService,
  });

  return {
    ...baseQueries,
  };
}
