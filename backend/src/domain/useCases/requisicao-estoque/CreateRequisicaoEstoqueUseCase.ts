import { EntityManager } from "typeorm";
import { CreateRequisicaoEstoqueDTO } from "../../../http/validators/requisicaoEstoque.schemas";
import { BadRequestError } from "../../../shared/errors";
import { Insumo } from "../../entities/Insumo";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { Requisitante } from "../../entities/Requisitante";
import { Setor } from "../../entities/Setor";
import { requisicaoEstoqueRepository } from "../../repositories";
import { registrarSaidaEstoqueUseCase } from "../estoque/RegistrarSaidaEstoqueUseCase";

export const createRequisicaoEstoqueUseCase = {
  async execute(dto: CreateRequisicaoEstoqueDTO): Promise<RequisicaoEstoque> {
    return await requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        await validate(dto, manager);
        const requisicao = await createRequisicao(dto, manager);
        await processarMovimentacoes(requisicao, manager);
        return requisicao;
      }
    );
  },
};

async function validate(
  dto: CreateRequisicaoEstoqueDTO,
  manager: EntityManager
): Promise<void> {
  const requisitante = await manager.findOne(Requisitante, {
    where: { id: dto.requisitante.id },
  });

  if (!requisitante) {
    throw new BadRequestError("Requisitante nao encontrado");
  }

  const setor = await manager.findOne(Setor, {
    where: { id: dto.setor.id },
  });

  if (!setor) {
    throw new BadRequestError("Setor não encontrado");
  }

  if (dto.itens.length === 0) {
    throw new BadRequestError("Requisição Estoque deve ter pelo menos um item");
  }

  for (const item of dto.itens) {
    const insumo = await manager.findOne(Insumo, {
      where: { id: item.insumo.id },
    });
    if (!insumo) {
      throw new BadRequestError("Insumo nao encontrado");
    }

    if (item.quantidade <= 0) {
      throw new BadRequestError("Quantidade deve ser maior que zero");
    }

    if (item.unidade !== insumo.undEstoque) {
      throw new BadRequestError("Unidade deve ser igual a unidade do estoque");
    }
  }
}

async function createRequisicao(
  dto: CreateRequisicaoEstoqueDTO,
  manager: EntityManager
): Promise<RequisicaoEstoque> {
  const requisicaoToCreate = requisicaoEstoqueRepository.create({
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
        insumo: itemDTO.insumo,
        quantidade: itemDTO.quantidade,
        unidade: itemDTO.unidade,
        valorUnitario: itemDTO.valorUnitario,
      };
    }),
  });

  return await manager.save(RequisicaoEstoque, requisicaoToCreate);
}

async function processarMovimentacoes(
  requisicao: RequisicaoEstoque,
  manager: EntityManager
): Promise<void> {
  for (const item of requisicao.itens) {
    await registrarSaidaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: requisicao.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigem: requisicao.id.toString(),
        tipoDocumento: "REQUISICAO",
        userId: requisicao.userId,
        data: requisicao.dataRequisicao,
      },
      manager
    );
  }
}
