import { User } from "../entities/User";
import { CrudService } from "./CrudService";

export interface UserService extends CrudService<string, User, User, User> {
  findByEmail(email: string): Promise<User>;
}
