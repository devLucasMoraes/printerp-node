import { emprestimoService } from "../../services/EmprestimoService";
import { useResourceQuery } from "./useResourceQuery";

export function useEmprestimoQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "emprestimo",
    service: emprestimoService,
  });

  return {
    ...baseQueries,
  };
}
