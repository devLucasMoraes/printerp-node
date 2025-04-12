import { EntityManager } from "typeorm";
import { UpdateRequisicaoEstoqueDTO } from "../../../http/validators/requisicaoEstoque.schemas";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Armazem } from "../../entities/Armazem";
import { Insumo } from "../../entities/Insumo";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { RequisicaoEstoqueItem } from "../../entities/RequisicaoEstoqueItem";
import { Requisitante } from "../../entities/Requisitante";
import { Setor } from "../../entities/Setor";
import { requisicaoEstoqueRepository } from "../../repositories";
import { registrarEntradaEstoqueUseCase } from "../estoque/RegistrarEntradaEstoqueUseCase";
import { registrarSaidaEstoqueUseCase } from "../estoque/RegistrarSaidaEstoqueUseCase";

export const updateRequisicaoEstoqueUseCase = {
  async execute(
    id: number,
    dto: UpdateRequisicaoEstoqueDTO
  ): Promise<RequisicaoEstoque> {
    return await requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        const requisicaoToUpdate = await findRequisicaoToUpdate(id, manager);
        const oldItems = new Map(
          requisicaoToUpdate.itens.map((item) => [item.id, item])
        );
        await validate(requisicaoToUpdate, dto, manager);
        await reverterMovimentacoes(requisicaoToUpdate, dto, manager);
        const requisicaoAtualizada = await updateRequisicao(
          requisicaoToUpdate,
          dto,
          manager
        );
        await processarNovasMovimentacoes(
          oldItems,
          requisicaoAtualizada,
          manager
        );

        return requisicaoAtualizada;
      }
    );
  },
};

async function findRequisicaoToUpdate(
  id: number,
  manager: EntityManager
): Promise<RequisicaoEstoque> {
  const requisicao = await manager.findOne(RequisicaoEstoque, {
    where: { id },
    relations: {
      requisitante: true,
      setor: true,
      armazem: true,
      itens: {
        insumo: true,
      },
    },
  });

  if (!requisicao) {
    throw new NotFoundError("RequisicaoEstoque not found");
  }

  return requisicao;
}

async function validate(
  requisicaoToUpdate: RequisicaoEstoque,
  requisicaoDTO: UpdateRequisicaoEstoqueDTO,
  manager: EntityManager
): Promise<void> {
  const requisitante = await manager.findOne(Requisitante, {
    where: { id: requisicaoDTO.requisitante.id },
  });

  if (!requisitante) {
    throw new BadRequestError("Requisitante não encontrado");
  }

  const setor = await manager.findOne(Setor, {
    where: { id: requisicaoDTO.setor.id },
  });

  if (!setor) {
    throw new BadRequestError("Setor não encontrado");
  }

  const armazem = await manager.findOne(Armazem, {
    where: { id: requisicaoDTO.armazem.id },
  });

  if (!armazem) {
    throw new BadRequestError("Armazem nao encontrado");
  }

  if (requisicaoDTO.itens.length === 0) {
    throw new BadRequestError("Requisicao Estoque deve ter pelo menos um item");
  }

  for (const itemDTO of requisicaoDTO.itens) {
    if (itemDTO.id !== null) {
      const itemPertence = requisicaoToUpdate.itens.some(
        (itemExistente) => itemExistente.id === itemDTO.id
      );

      if (!itemPertence) {
        throw new BadRequestError(
          `Não é possível atualizar o item de outra requisição`
        );
      }
    }
    const insumo = await manager.findOne(Insumo, {
      where: { id: itemDTO.insumo.id },
    });
    if (!insumo) {
      throw new BadRequestError("Insumo nao encontrado");
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
  requisicaoToUpdate: RequisicaoEstoque,
  requisicaoDTO: UpdateRequisicaoEstoqueDTO,
  manager: EntityManager
): Promise<void> {
  for (const item of requisicaoToUpdate.itens) {
    const itemCorrespondente = requisicaoDTO.itens.find(
      (i) => i.id === item.id
    );

    if (
      itemCorrespondente &&
      !(Number(itemCorrespondente.quantidade) !== Number(item.quantidade))
    ) {
      continue;
    }

    const params = {
      insumo: item.insumo,
      armazem: requisicaoToUpdate.armazem,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      undEstoque: item.unidade,
      documentoOrigem: requisicaoToUpdate.id.toString(),
      observacao: "Movimentação gerada por atualização de requisição",
      tipoDocumento: "ESTORNO_REQUISICAO",
      userId: requisicaoToUpdate.userId,
      data: requisicaoToUpdate.dataRequisicao,
    };

    await registrarEntradaEstoqueUseCase.execute(params, manager);
  }
}

async function updateRequisicao(
  requisicaoToUpdate: RequisicaoEstoque,
  dto: UpdateRequisicaoEstoqueDTO,
  manager: EntityManager
): Promise<RequisicaoEstoque> {
  const requisicaoDto = requisicaoEstoqueRepository.create({
    dataRequisicao: dto.dataRequisicao,
    ordemProducao: dto.ordemProducao,
    valorTotal: dto.valorTotal,
    obs: dto.obs,
    requisitante: dto.requisitante,
    setor: dto.setor,
    armazem: dto.armazem,
    userId: dto.userId,
    itens: dto.itens.map((itemDTO) => {
      return {
        id: itemDTO.id || undefined,
        insumo: itemDTO.insumo,
        quantidade: itemDTO.quantidade,
        unidade: itemDTO.unidade,
        valorUnitario: itemDTO.valorUnitario,
      };
    }),
  });

  const {
    requisitante: _r,
    setor: _e,
    itens: _i,
    ...requisicaoEstoqueWithoutRelations
  } = requisicaoToUpdate;

  const updatedRequisicaoEstoque = requisicaoEstoqueRepository.merge(
    requisicaoEstoqueWithoutRelations as RequisicaoEstoque,
    requisicaoDto
  );

  return await manager.save(RequisicaoEstoque, updatedRequisicaoEstoque);
}

async function processarNovasMovimentacoes(
  oldItems: Map<number, RequisicaoEstoqueItem>,
  requisicao: RequisicaoEstoque,
  manager: EntityManager
): Promise<void> {
  // Criar novas movimentações para cada item
  for (const item of requisicao.itens) {
    const itemAntigo = item.id ? oldItems.get(item.id) : null;

    // Se o item nao foi alterado, nao precisa criar movimentação
    if (
      itemAntigo &&
      Number(itemAntigo.quantidade) === Number(item.quantidade)
    ) {
      continue;
    }
    const params = {
      insumo: item.insumo,
      armazem: requisicao.armazem,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      undEstoque: item.unidade,
      documentoOrigem: requisicao.id.toString(),
      observacao: "",
      userId: requisicao.userId,
      tipoDocumento: "REQUISICAO",
      data: requisicao.dataRequisicao,
    };

    await registrarSaidaEstoqueUseCase.execute(params, manager);
  }
}
