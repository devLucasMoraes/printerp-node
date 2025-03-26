import { RequestHandler } from "express";
import { Emprestimo } from "../../domain/entities/Emprestimo";
import { EmprestimoService } from "../../domain/services/EmprestimoService";
import { EmprestimoServiceImpl } from "../../services/emprestimo/EmprestimoServiceImpl";
import { pageable } from "../../shared/utils/pageable";
import {
  CreateEmprestimoDTO,
  UpdateEmprestimoDTO,
} from "../validators/emprestimo.schema";

export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  list: RequestHandler = async (req, res) => {
    const result = await this.emprestimoService.list();

    const mappedResult = result.map(this.toDTO);

    res.status(200).json(mappedResult);
  };

  listPaginated: RequestHandler = async (req, res) => {
    const { page, size, sort } = req.query;
    const defaultSort = "dataEmprestimo,desc";
    const result = await this.emprestimoService.listPaginated(
      pageable(
        page as string,
        size as string,
        (sort as string | string[]) ?? (defaultSort as string | string[])
      )
    );

    const mappedResult = {
      ...result,
      content: result.content.map(this.toDTO),
    };

    res.status(200).json(mappedResult);
  };

  create: RequestHandler = async (req, res) => {
    const dto: CreateEmprestimoDTO = req.body;
    const userId = req.user.id;

    const result = await this.emprestimoService.create({
      ...dto,
      userId,
    });

    const mappedResult = this.toDTO(result);

    res.status(201).json(mappedResult);
  };

  show: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const result = await this.emprestimoService.show(parseInt(id));

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  update: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const dto: UpdateEmprestimoDTO = req.body;
    const userId = req.user.id;

    const result = await this.emprestimoService.update(parseInt(id), {
      ...dto,
      userId,
    });

    const mappedResult = this.toDTO(result);

    res.status(200).json(mappedResult);
  };

  delete: RequestHandler = async (req, res) => {
    const { id } = req.params;

    await this.emprestimoService.delete(parseInt(id));

    res.status(204).send();
  };

  toDTO(entity: Emprestimo) {
    return {
      id: entity.id,
      dataEmprestimo: entity.dataEmprestimo,
      previsaoDevolucao: entity.previsaoDevolucao,
      custoEstimado: entity.custoEstimado,
      tipo: entity.tipo,
      status: entity.status,
      userId: entity.userId,
      armazem: entity.armazem,
      parceiro: entity.parceiro,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      itens: entity.itens.map((item) => {
        return {
          id: item.id,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorUnitario: item.valorUnitario,
          insumo: {
            id: item.insumo.id,
            descricao: item.insumo.descricao,
            valorUntMed: item.insumo.valorUntMed,
            undEstoque: item.insumo.undEstoque,
          },
          devolucaoItens: item.devolucaoItens
            ? item.devolucaoItens.map((devolucaoItem) => {
                return {
                  id: devolucaoItem.id,
                  dataDevolucao: devolucaoItem.dataDevolucao,
                  quantidade: devolucaoItem.quantidade,
                  unidade: devolucaoItem.unidade,
                  valorUnitario: devolucaoItem.valorUnitario,
                  insumo: {
                    id: devolucaoItem.insumo.id,
                    descricao: devolucaoItem.insumo.descricao,
                    valorUntMed: devolucaoItem.insumo.valorUntMed,
                    undEstoque: devolucaoItem.insumo.undEstoque,
                  },
                };
              })
            : [],
        };
      }),
    };
  }
}

export const emprestimoController = new EmprestimoController(
  new EmprestimoServiceImpl()
);
