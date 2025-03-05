import { NotFoundError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { insumoRepository } from "../../repositories";

export const getInsumoUseCase = {
  async execute(id: number): Promise<Insumo> {
    const insumo = await insumoRepository.findOneBy({ id });

    if (!insumo) {
      throw new NotFoundError("Insumo não encontrado");
    }

    return insumo;
  },
};
