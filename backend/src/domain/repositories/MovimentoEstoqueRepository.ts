import { appDataSource } from "../../database";
import { MovimentoEstoque } from "../entities/MovimentoEstoque";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class MovimentoEstoqueRepository extends BaseRepository<MovimentoEstoque> {
  constructor() {
    const repository = appDataSource.getRepository(MovimentoEstoque);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(
    pageRequest?: PageRequest
  ): Promise<Page<MovimentoEstoque>> {
    return this.paginate(pageRequest, {}, {});
  }
}
