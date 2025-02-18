import { armazemService } from "../../services/ArmazemService";
import { useResourceQuery } from "./useResourceQuery";

export function useArmazemQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "ARMAZEM-KEY",
    service: armazemService,
  });

  return {
    ...baseQueries,
  };
}
