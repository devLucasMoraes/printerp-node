import { Armazem } from "../../entities/Armazem";
import { ArmazemRepository } from "../../repositories/ArmazemRepository";

export class GetAllArmazemUseCase {
  constructor(private readonly armazemRepository: ArmazemRepository) {}

  async execute(): Promise<Armazem[]> {
    return await this.armazemRepository.find();
  }
}
