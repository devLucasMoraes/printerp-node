import { UserDto } from "../schemas/user.schemas";
import { CrudService } from "./CrudService";

class UserService extends CrudService<string, UserDto> {
  constructor() {
    super("/users");
  }
}

export const userService = new UserService();
