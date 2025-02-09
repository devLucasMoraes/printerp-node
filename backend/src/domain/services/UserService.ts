import { User } from "../entities/User";
import { CrudService } from "./CrudService";

export interface UserService extends CrudService<string, User> {
  findByEmail(email: string): Promise<User>;
}
