import { userService } from "../../services/UserService";
import { useResourceQuery } from "./useResourceQuery";

export function useUserQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "USER-KEY",
    service: userService,
  });

  return {
    ...baseQueries,
  };
}
