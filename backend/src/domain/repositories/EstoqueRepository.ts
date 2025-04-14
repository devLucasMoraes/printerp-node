import { appDataSource } from "../../database";
import { Estoque } from "../entities/Estoque";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class EstoqueRepository extends BaseRepository<Estoque> {
  constructor() {
    const repository = appDataSource.getRepository(Estoque);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    return this.paginate(
      pageRequest,
      {},
      {
        armazem: true,
        insumo: {
          categoria: true,
        },
      }
    );
  }
}
