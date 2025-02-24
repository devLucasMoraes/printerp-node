import { userService } from "../../services/UserService";
import { useResourceQuery } from "./useResourceQuery";

export function useUserQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: "user",
    service: userService,
  });

  return {
    ...baseQueries,
  };
}
