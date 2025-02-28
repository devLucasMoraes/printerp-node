import { EntityManager } from "typeorm";
import { CreateCategoriaDTO } from "../../../http/validators/categoria.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { CategoriaRepository } from "../../repositories/CategoriaRepository";

export class CreateCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async execute(dto: CreateCategoriaDTO): Promise<Categoria> {
    return await this.categoriaRepository.manager.transaction(
      async (manager) => {
        await this.validate(dto, manager);
        const categoria = await this.createCategoria(dto, manager);
        return categoria;
      }
    );
  }

  private async validate(
    dto: CreateCategoriaDTO,
    manager: EntityManager
  ): Promise<void> {
    const categoria = await manager.getRepository(Categoria).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (categoria && categoria.ativo === true) {
      throw new BadRequestError(`Categoria "${categoria.nome}" já cadastrada`);
    }

    if (categoria && categoria.ativo === false) {
      throw new BadRequestError(
        `Categoria "${categoria.nome}" já cadastrada e desativada`
      );
    }
  }

  private async createCategoria(
    dto: CreateCategoriaDTO,
    manager: EntityManager
  ): Promise<Categoria> {
    const categoriaToCreate = this.categoriaRepository.create({
      nome: dto.nome,
      userId: dto.userId,
    });

    return await manager.save(Categoria, categoriaToCreate);
  }
}
