import { EntityManager } from "typeorm";
import { UpdateEmprestimoDTO } from "../../../http/validators/emprestimo.schema";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { Emprestimo } from "../../entities/Emprestimo";
import { Insumo } from "../../entities/Insumo";
import { Parceiro } from "../../entities/Parceiro";
import { emprestimoRepository } from "../../repositories";
import { registrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";
import { registrarSaidaEstoqueUseCase } from "../estoque/RegistrarSaidaEstoqueUseCase";

export const updateEmprestimoUseCase = {
  async execute(id: number, dto: UpdateEmprestimoDTO): Promise<Emprestimo> {
    return await emprestimoRepository.manager.transaction(async (manager) => {
      const emprestimoToUpdate = await findEmprestimoToUpdate(id, manager);
      await validate(emprestimoToUpdate, dto, manager);
      await reverterMovimentacoes(emprestimoToUpdate, manager);
      const emprestimoAtualizada = await updateEmprestimo(
        emprestimoToUpdate,
        dto,
        manager
      );
      await processarNovasMovimentacoes(emprestimoAtualizada, manager);

      return emprestimoAtualizada;
    });
  },
};

async function findEmprestimoToUpdate(
  id: number,
  manager: EntityManager
): Promise<Emprestimo> {
  const emprestimo = await manager.findOne(Emprestimo, {
    where: { id },
    relations: {
      parceiro: true,
      armazem: true,
      itens: {
        insumo: true,
        devolucaoItens: {
          insumo: true,
        },
      },
    },
  });

  if (!emprestimo) {
    throw new NotFoundError("Emprestimo not found");
  }

  return emprestimo;
}

async function validate(
  emprestimoToUpdate: Emprestimo,
  emprestimoDTO: UpdateEmprestimoDTO,
  manager: EntityManager
): Promise<void> {
  const parceiro = await manager.findOne(Parceiro, {
    where: { id: emprestimoDTO.parceiro.id },
  });

  if (!parceiro) {
    throw new BadRequestError("Parceiro não encontrado");
  }

  const armazem = await manager.findOne(Armazem, {
    where: { id: emprestimoDTO.armazem.id },
  });

  if (!armazem) {
    throw new BadRequestError("Armazém não encontrado");
  }

  if (emprestimoDTO.itens.length === 0) {
    throw new BadRequestError("Empréstimo deve ter pelo menos um item");
  }

  for (const itemDTO of emprestimoDTO.itens) {
    if (itemDTO.id !== null) {
      const itemPertence = emprestimoToUpdate.itens.some(
        (itemExistente) => itemExistente.id === itemDTO.id
      );

      if (!itemPertence) {
        throw new BadRequestError(
          `Não é possível atualizar o item de outro empréstimo`
        );
      }
    }
    const insumo = await manager.findOne(Insumo, {
      where: { id: itemDTO.insumo.id },
    });
    if (!insumo) {
      throw new BadRequestError("Insumo não encontrado");
    }
    if (itemDTO.quantidade <= 0) {
      throw new BadRequestError("Quantidade deve ser maior que zero");
    }
    if (itemDTO.unidade !== insumo.undEstoque) {
      throw new BadRequestError("Unidade deve ser igual a unidade do estoque");
    }
  }
}

async function reverterMovimentacoes(
  emprestimoToUpdate: Emprestimo,
  manager: EntityManager
): Promise<void> {
  for (const item of emprestimoToUpdate.itens) {
    await registrarEntradaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: emprestimoToUpdate.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigem: emprestimoToUpdate.id.toString(),
        tipoDocumento: "ESTORNO_REQUISICAO",
        observacao: `Estorno da movimentação ${emprestimoToUpdate.id} - Atualização de requisição`,
        userId: emprestimoToUpdate.userId,
      },
      manager
    );
  }
}

async function updateEmprestimo(
  emprestimoToUpdate: Emprestimo,
  dto: UpdateEmprestimoDTO,
  manager: EntityManager
): Promise<Emprestimo> {
  const emprestimoDto = emprestimoRepository.create({
    tipo: dto.tipo,
    status: dto.status,
    dataEmprestimo: dto.dataEmprestimo,
    previsaoDevolucao: dto.previsaoDevolucao,
    custoEstimado: dto.custoEstimado,
    parceiro: dto.parceiro,
    armazem: dto.armazem,
    userId: dto.userId,
    itens: dto.itens.map((itemDTO) => {
      return {
        insumo: itemDTO.insumo,
        quantidade: itemDTO.quantidade,
        unidade: itemDTO.unidade,
        valorUnitario: itemDTO.valorUnitario,
      };
    }),
  });

  const {
    parceiro: _p,
    armazem: _a,
    itens: _i,
    ...emprestimoWithoutRelations
  } = emprestimoToUpdate;

  const updatedEmprestimo = emprestimoRepository.merge(
    emprestimoWithoutRelations as Emprestimo,
    emprestimoDto
  );

  return await manager.save(Emprestimo, updatedEmprestimo);
}

async function processarNovasMovimentacoes(
  emprestimo: Emprestimo,
  manager: EntityManager
): Promise<void> {
  // Criar novas movimentações para cada item
  for (const item of emprestimo.itens) {
    await registrarSaidaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: emprestimo.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigem: emprestimo.id.toString(),
        tipoDocumento: "REQUISICAO",
        observacao: "Movimentação gerada por atualização de requisição",
        userId: emprestimo.userId,
      },
      manager
    );
  }
}
