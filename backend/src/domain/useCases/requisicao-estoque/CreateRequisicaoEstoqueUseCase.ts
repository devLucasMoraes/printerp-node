import { EntityManager } from "typeorm";
import { CreateRequisicaoEstoqueDTO } from "../../../http/validators/requisicaoEstoque.schemas";
import { NotFoundError } from "../../../shared/errors";
import { Estoque } from "../../entities/Estoque";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { RequisicaoEstoque } from "../../entities/RequisicaoEstoque";
import { MovimentoEstoqueRepository } from "../../repositories/MovimentoEstoqueRepository";
import { RequisicaoEstoqueRepository } from "../../repositories/RequisicaoEstoqueRepository";

export class CreateRequisicaoEstoqueUseCase {
  constructor(
    private readonly requisicaoEstoqueRepository: RequisicaoEstoqueRepository,
    private readonly movimentoEstoqueRepository: MovimentoEstoqueRepository
  ) {}

  async execute(dto: CreateRequisicaoEstoqueDTO): Promise<RequisicaoEstoque> {
    return await this.requisicaoEstoqueRepository.manager.transaction(
      async (manager) => {
        await this.validarDisponibilidadeEstoque(dto, manager);
        const requisicao = await this.criarRequisicao(dto, manager);
        await this.processarMovimentacoes(requisicao, manager);
        return requisicao;
      }
    );
  }

  private async validarDisponibilidadeEstoque(
    dto: CreateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<void> {
    for (const item of dto.itens) {
      const estoque = await manager.getRepository(Estoque).findOne({
        where: {
          insumo: { id: item.insumo.id },
          armazem: { id: dto.armazem.id },
        },
      });

      if (!estoque) {
        throw new NotFoundError(
          `Insumo ${item.insumo.id} não encontrado no armazém ${dto.armazem.id}`
        );
      }

      /*
      if (!estoque.possuiQuantidadeSuficiente(item.quantidade)) {
        throw new BadRequestError(
          `Quantidade insuficiente do insumo ${item.insumo.id} no armazém ${dto.armazem.id}`
        );
      }
      */
    }
  }

  private async criarRequisicao(
    dto: CreateRequisicaoEstoqueDTO,
    manager: EntityManager
  ): Promise<RequisicaoEstoque> {
    const requisicaoToCreate = this.requisicaoEstoqueRepository.create({
      dataRequisicao: dto.dataRequisicao,
      ordemProducao: dto.ordemProducao,
      valorTotal: dto.valorTotal,
      obs: dto.obs,
      requisitante: dto.requisitante,
      equipamento: dto.equipamento,
      armazem: dto.armazem,
      itens: dto.itens.map((itemDTO) => {
        return {
          insumo: itemDTO.insumo,
          quantidade: itemDTO.quantidade,
          undEstoque: itemDTO.undEstoque,
          valorUnitario: itemDTO.valorUnitario,
        };
      }),
    });

    return await manager.save(RequisicaoEstoque, requisicaoToCreate);
  }

  private async processarMovimentacoes(
    requisicao: RequisicaoEstoque,
    manager: EntityManager
  ): Promise<void> {
    for (const item of requisicao.itens) {
      const movimentoToCreate = this.movimentoEstoqueRepository.create({
        tipo: "SAIDA",
        data: new Date(),
        insumo: item.insumo,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.undEstoque,
        armazemOrigem: requisicao.armazem,
        documentoOrigem: requisicao.id.toString(),
        tipoDocumento: "REQUISICAO",
        regularizado: true,
      });

      await manager.save(MovimentoEstoque, movimentoToCreate);

      // Atualizar estoque
      const estoque = await manager.findOne(Estoque, {
        where: {
          insumo: { id: item.insumo.id },
          armazem: { id: requisicao.armazem.id },
        },
      });

      if (!estoque) {
        throw new NotFoundError(
          `Insumo ${item.insumo.id} não encontrado no armazém ${requisicao.armazem.id}`
        );
      }

      estoque.quantidade -= item.quantidade;
      await manager.save(Estoque, estoque);
    }
  }
}
