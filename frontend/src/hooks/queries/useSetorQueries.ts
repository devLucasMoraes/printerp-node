import { setorService } from "../../services/SetorService";
import { useResourceQuery } from "./useResourceQuery";

export function useSetorQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "setores",
    service: setorService,
  });

  return {
    ...baseQueries,
  };
}
