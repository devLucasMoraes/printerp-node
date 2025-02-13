import { requisicaoEstoqueService } from "../../services/RequisicaoEstoqueService";
import { useResourceQuery } from "./useResourceQuery";

export function useRequisicaoEstoqueQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "REQUISICAO-ESTOQUE-KEY",
    service: requisicaoEstoqueService,
  });

  return {
    ...baseQueries,
  };
}
