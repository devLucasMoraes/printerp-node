import { NotFoundError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { ArmazemRepository } from "../../repositories/ArmazemRepository";

export class GetArmazemUseCase {
  constructor(private readonly armazemRepository: ArmazemRepository) {}

  async execute(id: number): Promise<Armazem> {
    const armazem = await this.armazemRepository.findOneWithRelations(id);

    if (!armazem) {
      throw new NotFoundError("Armazém não encontrado");
    }

    return armazem;
  }
}
