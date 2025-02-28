import { Equipamento } from "../../entities/Equipamento";
import { EquipamentoRepository } from "../../repositories/EquipamentoRepository";

export class GetAllEquipamentoUseCase {
  constructor(private readonly equipamentoRepository: EquipamentoRepository) {}

  async execute(): Promise<Equipamento[]> {
    return await this.equipamentoRepository.find();
  }
}
