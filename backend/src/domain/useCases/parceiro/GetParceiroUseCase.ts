import { NotFoundError } from "../../../shared/errors";
import { Parceiro } from "../../entities/Parceiro";
import { parceiroRepository } from "../../repositories";

export const getParceiroUseCase = {
  async execute(id: number): Promise<Parceiro> {
    const parceiro = await parceiroRepository.findOneBy({ id });

    if (!parceiro) {
      throw new NotFoundError("Parceiro não encontrado");
    }

    return parceiro;
  },
};
