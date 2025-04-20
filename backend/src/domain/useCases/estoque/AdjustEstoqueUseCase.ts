import { EntityManager } from "typeorm";
import { AdjustEstoqueDTO } from "../../../http/validators/estoque.schema";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Estoque } from "../../entities/Estoque";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import {
  estoqueRepository,
  movimentoEstoqueRepository,
} from "../../repositories";
import { atualizarConsumoMedioDiarioUseCase } from "./AtualizarConsumoMedioDiarioUseCase";

export const adjustEstoqueUseCase = {
  async execute(id: number, dto: AdjustEstoqueDTO): Promise<Estoque> {
    return await estoqueRepository.manager.transaction(async (manager) => {
      const estoqueToAdjust = await findEstoque(id, manager);
      await validate(estoqueToAdjust, dto, manager);
      await processarMovimentacoes(estoqueToAdjust, dto, manager);
      const adjustedEstoque = await adjustEstoque(
        estoqueToAdjust,
        dto,
        manager
      );
      await atualizarConsumoMedioDiario(adjustedEstoque, manager);

      return adjustedEstoque;
    });
  },
};

async function findEstoque(
  id: number,
  manager: EntityManager
): Promise<Estoque> {
  const estoque = await manager.findOne(Estoque, {
    where: { id },
    relations: {
      insumo: true,
      armazem: true,
    },
  });

  if (!estoque) {
    throw new NotFoundError("RequisicaoEstoque not found");
  }

  return estoque;
}

async function validate(
  estoqueToAdjust: Estoque,
  dto: AdjustEstoqueDTO,
  manager: EntityManager
): Promise<void> {
  if (estoqueToAdjust.id !== dto.id) {
    throw new BadRequestError("Id do armazém não pode ser alterado");
  }
  const diferenca = Number(dto.quantidade) - Number(estoqueToAdjust.quantidade);

  if (diferenca === 0) {
    throw new BadRequestError("Quantidade a ser ajustada não pode ser a mesma");
  }
}

async function adjustEstoque(
  estoqueToAdjust: Estoque,
  dto: AdjustEstoqueDTO,
  manager: EntityManager
): Promise<Estoque> {
  const ajustEstoqueDto = estoqueRepository.create({
    quantidade: dto.quantidade,
  });

  const ajustedEstoque = estoqueRepository.merge(
    estoqueToAdjust,
    ajustEstoqueDto
  );

  return await manager.save(Estoque, ajustedEstoque);
}

async function processarMovimentacoes(
  estoque: Estoque,
  dto: AdjustEstoqueDTO,
  manager: EntityManager
): Promise<void> {
  const diferenca = Number(dto.quantidade) - Number(estoque.quantidade);

  if (diferenca > 0) {
    const movimentacaoEntrada = movimentoEstoqueRepository.create({
      tipo: "ENTRADA",
      data: new Date(),
      insumo: estoque.insumo,
      quantidade: Math.abs(diferenca),
      valorUnitario: estoque.insumo.valorUntMed,
      undidade: estoque.insumo.undEstoque,
      armazemDestino: estoque.armazem,
      documentoOrigem: estoque.id.toString(),
      tipoDocumento: "ESTOQUE",
      regularizado: true,
      observacao: "Ajuste de estoque",
      userId: dto.userId,
    });

    await manager.save(MovimentoEstoque, movimentacaoEntrada);
  }

  if (diferenca < 0) {
    const movimentacaoSaida = movimentoEstoqueRepository.create({
      tipo: "SAIDA",
      data: new Date(),
      insumo: estoque.insumo,
      quantidade: Math.abs(diferenca),
      valorUnitario: estoque.insumo.valorUntMed,
      undidade: estoque.insumo.undEstoque,
      armazemOrigem: estoque.armazem,
      documentoOrigem: estoque.id.toString(),
      tipoDocumento: "ESTOQUE",
      regularizado: true,
      observacao: "Ajuste de estoque",
      userId: dto.userId,
    });

    await manager.save(MovimentoEstoque, movimentacaoSaida);
  }
}

async function atualizarConsumoMedioDiario(
  estoque: Estoque,
  manager: EntityManager
): Promise<void> {
  await atualizarConsumoMedioDiarioUseCase.execute(
    estoque.insumo.id,
    estoque.armazem.id,
    manager,
    true // Forçar atualização
  );
}
