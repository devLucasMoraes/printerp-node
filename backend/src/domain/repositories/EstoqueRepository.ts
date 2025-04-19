import { FindOptionsWhere, ILike } from "typeorm";
import { appDataSource } from "../../database";
import { Estoque } from "../entities/Estoque";
import { BaseRepository, Page, PageRequest } from "./BaseRepository";

export class EstoqueRepository extends BaseRepository<Estoque> {
  constructor() {
    const repository = appDataSource.getRepository(Estoque);
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    const filters = pageRequest?.filters || {};

    console.log("\nfilters", filters);
    const where: FindOptionsWhere<Estoque> = {};
    if (Object.keys(filters).length > 0) {
      where.insumo = {};

      if (filters.insumo) {
        where.insumo.descricao = ILike(`%${filters.insumo}%`);
      }

      if (filters.estaAbaixoMinimo) {
        where.estaAbaixoMinimo = filters.estaAbaixoMinimo;
      }
    }
    return this.paginate(pageRequest, where, {
      armazem: true,
      insumo: {
        categoria: true,
      },
    });
  }
}
