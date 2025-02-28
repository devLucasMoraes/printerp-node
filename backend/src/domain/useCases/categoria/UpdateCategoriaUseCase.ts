import { EntityManager } from "typeorm";
import { UpdateCategoriaDTO } from "../../../http/validators/categoria.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Categoria } from "../../entities/Categoria";
import { CategoriaRepository } from "../../repositories/CategoriaRepository";

export class UpdateCategoriaUseCase {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  async execute(id: number, dto: UpdateCategoriaDTO): Promise<Categoria> {
    return await this.categoriaRepository.manager.transaction(
      async (manager) => {
        const categoriaToUpdate = await this.findCategoriaToUpdate(id, manager);
        await this.validate(id, dto, manager);
        const categoria = await this.update(categoriaToUpdate, dto, manager);
        return categoria;
      }
    );
  }

  private async findCategoriaToUpdate(
    id: number,
    manager: EntityManager
  ): Promise<Categoria> {
    const categoria = await manager.findOne(Categoria, {
      where: { id },
    });

    if (!categoria) {
      throw new BadRequestError("Armazém não encontrado");
    }

    return categoria;
  }

  private async validate(
    id: number,
    dto: UpdateCategoriaDTO,
    manager: EntityManager
  ): Promise<void> {
    const categoria = await manager.getRepository(Categoria).findOne({
      where: { nome: dto.nome },
      withDeleted: true,
    });

    if (id !== dto.id) {
      throw new BadRequestError("Id do armazém não pode ser alterado");
    }

    if (categoria && categoria.ativo === true && categoria.id !== dto.id) {
      throw new BadRequestError(`Armazém "${categoria.nome}" já cadastrado`);
    }

    if (categoria && categoria.ativo === false) {
      throw new BadRequestError(
        `Armazém "${categoria.nome}" já cadastrado e desativado`
      );
    }
  }

  private async update(
    categoriaToUpdate: Categoria,
    dto: UpdateCategoriaDTO,
    manager: EntityManager
  ): Promise<Categoria> {
    const categoriaDTO = this.categoriaRepository.create({
      id: dto.id,
      nome: dto.nome,
      userId: dto.userId,
    });

    const categoria = this.categoriaRepository.merge(
      categoriaToUpdate,
      categoriaDTO
    );

    return await manager.save(Categoria, categoria);
  }
}
