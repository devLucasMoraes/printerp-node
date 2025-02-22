import { EntityManager } from "typeorm";
import { AdjustEstoqueDTO } from "../../../http/validators/estoque.schema";
import { BadRequestError, NotFoundError } from "../../../shared/errors";
import { Estoque } from "../../entities/Estoque";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";
import { EstoqueRepository } from "../../repositories/EstoqueRepository";
import { MovimentoEstoqueRepository } from "../../repositories/MovimentoEstoqueRepository";

export class AdjustEstoqueUseCase {
  constructor(
    private readonly estoqueRepository: EstoqueRepository,
    private readonly movimentoEstoqueRepository: MovimentoEstoqueRepository
  ) {}

  async execute(id: number, dto: AdjustEstoqueDTO): Promise<Estoque> {
    return await this.estoqueRepository.manager.transaction(async (manager) => {
      const estoqueToAdjust = await this.findEstoque(id, manager);
      await this.validate(estoqueToAdjust, dto, manager);
      await this.processarMovimentacoes(estoqueToAdjust, dto, manager);
      const adjustedEstoque = await this.adjustEstoque(
        estoqueToAdjust,
        dto,
        manager
      );

      return adjustedEstoque;
    });
  }

  private async findEstoque(
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

  private async validate(
    estoqueToAdjust: Estoque,
    dto: AdjustEstoqueDTO,
    manager: EntityManager
  ): Promise<void> {
    if (estoqueToAdjust.id !== dto.id) {
      throw new BadRequestError("Id do armazém não pode ser alterado");
    }
    const diferenca =
      Number(dto.quantidade) - Number(estoqueToAdjust.quantidade);

    if (diferenca === 0) {
      throw new BadRequestError(
        "Quantidade a ser ajustada não pode ser a mesma"
      );
    }
  }

  private async adjustEstoque(
    estoqueToAdjust: Estoque,
    dto: AdjustEstoqueDTO,
    manager: EntityManager
  ): Promise<Estoque> {
    const ajustEstoqueDto = this.estoqueRepository.create({
      quantidade: dto.quantidade,
    });

    const ajustedEstoque = this.estoqueRepository.merge(
      estoqueToAdjust,
      ajustEstoqueDto
    );

    return await manager.save(Estoque, ajustedEstoque);
  }

  private async processarMovimentacoes(
    estoque: Estoque,
    dto: AdjustEstoqueDTO,
    manager: EntityManager
  ): Promise<void> {
    const diferenca = Number(dto.quantidade) - Number(estoque.quantidade);

    if (diferenca > 0) {
      const movimentacaoEntrada = this.movimentoEstoqueRepository.create({
        tipo: "ENTRADA",
        data: new Date(),
        insumo: estoque.insumo,
        quantidade: Math.abs(diferenca),
        valorUnitario: estoque.insumo.valorUntMed,
        undEstoque: estoque.insumo.undEstoque,
        armazemDestino: estoque.armazem,
        documentoOrigem: estoque.id.toString(),
        tipoDocumento: "ESTOQUE",
        regularizado: true,
        observacao: "Ajuste de estoque",
      });

      await manager.save(MovimentoEstoque, movimentacaoEntrada);
    }

    if (diferenca < 0) {
      const movimentacaoSaida = this.movimentoEstoqueRepository.create({
        tipo: "SAIDA",
        data: new Date(),
        insumo: estoque.insumo,
        quantidade: Math.abs(diferenca),
        valorUnitario: estoque.insumo.valorUntMed,
        undEstoque: estoque.insumo.undEstoque,
        armazemDestino: estoque.armazem,
        documentoOrigem: estoque.id.toString(),
        tipoDocumento: "ESTOQUE",
        regularizado: true,
        observacao: "Ajuste de estoque",
      });

      await manager.save(MovimentoEstoque, movimentacaoSaida);
    }
  }
}
