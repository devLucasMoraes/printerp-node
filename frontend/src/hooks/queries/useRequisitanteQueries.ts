import { requisitanteService } from "../../services/RequisitanteService";
import { useResourceQuery } from "./useResourceQuery";

export function useRequisitanteQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "REQUISITANTE-KEY",
    service: requisitanteService,
  });

  return {
    ...baseQueries,
  };
}
