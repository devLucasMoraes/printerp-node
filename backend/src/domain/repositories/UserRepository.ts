import { appDataSource } from "../../database";
import { User } from "../../domain/entities/User";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    const repository = appDataSource.getRepository(User);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<User>> {
    return this.paginate(pageRequest);
  }
}
