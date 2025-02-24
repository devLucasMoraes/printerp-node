import { categoriaService } from "../../services/CategoriaService";
import { useResourceQuery } from "./useResourceQuery";

export function useCategoriaQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "categoria",
    service: categoriaService,
  });

  return {
    ...baseQueries,
  };
}
