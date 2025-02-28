import { Insumo } from "../../entities/Insumo";
import { InsumoRepository } from "../../repositories/InsumoRepository";

export class GetAllInsumoUseCase {
  constructor(private readonly insumoRepository: InsumoRepository) {}

  async execute(): Promise<Insumo[]> {
    return await this.insumoRepository.find();
  }
}
