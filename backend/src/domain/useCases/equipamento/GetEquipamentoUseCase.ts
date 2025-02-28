import { NotFoundError } from "../../../shared/errors";
import { Equipamento } from "../../entities/Equipamento";
import { EquipamentoRepository } from "../../repositories/EquipamentoRepository";

export class GetEquipamentoUseCase {
  constructor(private readonly equipamentoRepository: EquipamentoRepository) {}

  async execute(id: number): Promise<Equipamento> {
    const equipamento = await this.equipamentoRepository.findOneBy({ id });

    if (!equipamento) {
      throw new NotFoundError("Equipamento não encontrado");
    }

    return equipamento;
  }
}
