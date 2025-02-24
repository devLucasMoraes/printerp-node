import { requisicaoEstoqueService } from "../../services/RequisicaoEstoqueService";
import { useResourceQuery } from "./useResourceQuery";

export function useRequisicaoEstoqueQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "requisicaoEstoque",
    service: requisicaoEstoqueService,
  });

  return {
    ...baseQueries,
  };
}
