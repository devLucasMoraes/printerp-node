import { NotFoundError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { InsumoRepository } from "../../repositories/InsumoRepository";

export class GetInsumoUseCase {
  constructor(private readonly insumoRepository: InsumoRepository) {}

  async execute(id: number): Promise<Insumo> {
    const insumo = await this.insumoRepository.findOneBy({ id });

    if (!insumo) {
      throw new NotFoundError("Insumo não encontrado");
    }

    return insumo;
  }
}
