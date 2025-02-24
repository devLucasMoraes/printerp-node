import { equipamentoService } from "../../services/EquipamentoService";
import { useResourceQuery } from "./useResourceQuery";

export function useEquipamentoQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "equipamento",
    service: equipamentoService,
  });

  return {
    ...baseQueries,
  };
}
