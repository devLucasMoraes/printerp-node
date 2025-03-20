import { Emprestimo } from "../../domain/entities/Emprestimo";
import { Unidade } from "../../domain/entities/Unidade";
import { Page, PageRequest } from "../../domain/repositories/BaseRepository";
import { EmprestimoService } from "../../domain/services/EmprestimoService";

export class EmprestimoServiceImpl implements EmprestimoService {
  listPaginated(pageRequest?: PageRequest): Promise<Page<Emprestimo>> {
    throw new Error("Method not implemented.");
  }
  list(): Promise<Emprestimo[]> {
    throw new Error("Method not implemented.");
  }
  show(id: number): Promise<Emprestimo> {
    throw new Error("Method not implemented.");
  }
  create(dto: {
    dataEmprestimo: Date;
    previsaoDevolucao: Date | null;
    custoEstimado: number;
    tipo: string;
    status: string;
    parceiro: { id: number };
    armazem: { id: number };
    itens: {
      id: null;
      quantidade: number;
      unidade: Unidade;
      valorUnitario: number;
      insumo: { id: number };
      devolucaoItens: {
        id: null;
        quantidade: number;
        unidade: Unidade;
        valorUnitario: number;
        insumo: { id: number };
        dataDevolucao: Date;
      }[];
    }[];
    userId?: string | undefined;
  }): Promise<Emprestimo> {
    throw new Error("Method not implemented.");
  }
  update(
    id: number,
    dto: {
      dataEmprestimo: Date;
      previsaoDevolucao: Date | null;
      custoEstimado: number;
      tipo: string;
      status: string;
      parceiro: { id: number };
      armazem: { id: number };
      itens: {
        id: number | null;
        quantidade: number;
        unidade: Unidade;
        valorUnitario: number;
        insumo: { id: number };
        devolucaoItens: {
          id: number | null;
          quantidade: number;
          unidade: Unidade;
          valorUnitario: number;
          insumo: { id: number };
          dataDevolucao: Date;
        }[];
      }[];
      userId?: string | undefined;
    }
  ): Promise<Emprestimo> {
    throw new Error("Method not implemented.");
  }
  delete(id: number, userID?: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
