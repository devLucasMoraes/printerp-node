import { EntityManager } from "typeorm";
import { CreateEmprestimoDTO } from "../../../http/validators/emprestimo.schema";
import { BadRequestError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { Emprestimo } from "../../entities/Emprestimo";
import { Insumo } from "../../entities/Insumo";
import { Parceiro } from "../../entities/Parceiro";
import { emprestimoRepository } from "../../repositories";
import { registrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";
import { registrarSaidaEstoqueUseCase } from "../estoque/RegistrarSaidaEstoqueUseCase";

export const createEmprestimoUseCase = {
  async execute(dto: CreateEmprestimoDTO): Promise<Emprestimo> {
    return await emprestimoRepository.manager.transaction(async (manager) => {
      await validate(dto, manager);
      const emprestimo = await createEmprestimo(dto, manager);
      await processarMovimentacoes(emprestimo, manager);
      return emprestimo;
    });
  },
};

async function validate(
  dto: CreateEmprestimoDTO,
  manager: EntityManager
): Promise<void> {
  const parceiro = await manager.findOne(Parceiro, {
    where: { id: dto.parceiro.id },
  });

  if (!parceiro) {
    throw new BadRequestError("Parceiro não encontrado");
  }

  const armazem = await manager.findOne(Armazem, {
    where: { id: dto.armazem.id },
  });

  if (!armazem) {
    throw new BadRequestError("Armazém não encontrado");
  }

  if (dto.itens.length === 0) {
    throw new BadRequestError("Emprestimo deve ter pelo menos um item");
  }

  for (const item of dto.itens) {
    const insumo = await manager.findOne(Insumo, {
      where: { id: item.insumo.id },
    });
    if (!insumo) {
      throw new BadRequestError("Insumo não encontrado");
    }

    if (item.quantidade <= 0) {
      throw new BadRequestError("Quantidade deve ser maior que zero");
    }

    if (item.unidade !== insumo.undEstoque) {
      throw new BadRequestError("Unidade deve ser igual a unidade do estoque");
    }
  }
}

async function createEmprestimo(
  dto: CreateEmprestimoDTO,
  manager: EntityManager
): Promise<Emprestimo> {
  const emprestimoToCreate = emprestimoRepository.create({
    tipo: dto.tipo,
    status: dto.status,
    dataEmprestimo: dto.dataEmprestimo,
    previsaoDevolucao: dto.previsaoDevolucao,
    custoEstimado: dto.custoEstimado,
    parceiro: dto.parceiro,
    armazem: dto.armazem,
    userId: dto.userId,
    obs: dto.obs,
    itens: dto.itens.map((itemDTO) => {
      return {
        insumo: itemDTO.insumo,
        quantidade: itemDTO.quantidade,
        unidade: itemDTO.unidade,
        valorUnitario: itemDTO.valorUnitario,
      };
    }),
  });

  return await manager.save(Emprestimo, emprestimoToCreate);
}

async function processarMovimentacoes(
  emprestimo: Emprestimo,
  manager: EntityManager
): Promise<void> {
  for (const item of emprestimo.itens) {
    if (emprestimo.tipo === "ENTRADA") {
      await registrarEntradaEstoqueUseCase.execute(
        {
          insumo: item.insumo,
          armazem: emprestimo.armazem,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          undEstoque: item.unidade,
          documentoOrigem: emprestimo.id.toString(),
          tipoDocumento: "EMPRESTIMO",
          userId: emprestimo.userId,
          data: emprestimo.dataEmprestimo,
        },
        manager
      );
    }
    if (emprestimo.tipo === "SAIDA") {
      await registrarSaidaEstoqueUseCase.execute(
        {
          insumo: item.insumo,
          armazem: emprestimo.armazem,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          undEstoque: item.unidade,
          documentoOrigem: emprestimo.id.toString(),
          tipoDocumento: "EMPRESTIMO",
          userId: emprestimo.userId,
          data: emprestimo.dataEmprestimo,
        },
        manager
      );
    }
  }
}
