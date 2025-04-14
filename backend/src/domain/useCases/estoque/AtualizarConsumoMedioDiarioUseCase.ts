import { EntityManager } from "typeorm";
import { Estoque } from "../../entities/Estoque";
import { MovimentoEstoque } from "../../entities/MovimentoEstoque";

const MAX_DOCUMENTOS_ORIGEM = 10;

export const atualizarConsumoMedioDiarioUseCase = {
  async execute(
    insumoId: number,
    armazemId: number,
    manager: EntityManager,
    forcarAtualizacao: boolean = false
  ): Promise<void> {
    // Buscar o estoque e verificar se precisa atualizar
    const estoque = await manager.findOne(Estoque, {
      where: {
        insumo: { id: insumoId },
        armazem: { id: armazemId },
      },
    });

    if (!estoque) return;

    // Verificar se já foi atualizado hoje
    if (!forcarAtualizacao && estoque.ultimaAtualizacaoConsumo) {
      const hoje = new Date();
      const ultimaAtualizacao = new Date(estoque.ultimaAtualizacaoConsumo);

      if (
        hoje.getDate() === ultimaAtualizacao.getDate() &&
        hoje.getMonth() === ultimaAtualizacao.getMonth() &&
        hoje.getFullYear() === ultimaAtualizacao.getFullYear()
      ) {
        return;
      }
    }

    // Buscar documentos de origem e suas movimentações em uma única consulta
    /*
    SELECT
    movimento.documento_origem AS "documentoOrigem",
    MAX(movimento.data) AS "dataMaxima",
    SUM(CASE 
        WHEN movimento.tipo = 'SAIDA' 
        THEN movimento.quantidade 
        ELSE 0 
    END) AS "totalSaidas",
    SUM(CASE 
        WHEN movimento.tipo_documento = 'ESTORNO_REQUISICAO' 
        THEN movimento.quantidade 
        ELSE 0 
    END) AS "totalEstornos",
    MIN(CASE 
        WHEN movimento.tipo = 'SAIDA' 
        THEN movimento.data 
        ELSE NULL 
    END) AS "dataPrimeiraSaida"
FROM
    movimento_estoque movimento
WHERE
    movimento.insumo_id = 123  -- Substituir pelo ID real do insumo
    AND (
        (movimento.tipo = 'SAIDA')
        OR movimento.tipo_documento = 'ESTORNO_REQUISICAO'
    )
GROUP BY
    movimento.documento_origem
ORDER BY
    "dataMaxima" DESC
LIMIT 10;  -- MAX_DOCUMENTOS_ORIGEM = 10
    */
    const documentosComMovimentacoes = await manager
      .createQueryBuilder(MovimentoEstoque, "movimento")
      .select("movimento.documentoOrigem", "documentoOrigem")
      .addSelect("MAX(movimento.data)", "data")
      .addSelect(
        "SUM(CASE WHEN movimento.tipo = 'SAIDA' THEN movimento.quantidade ELSE 0 END)",
        "totalSaidas"
      )
      .addSelect(
        "SUM(CASE WHEN movimento.tipoDocumento = 'ESTORNO_REQUISICAO' THEN movimento.quantidade ELSE 0 END)",
        "totalEstornos"
      )
      .addSelect(
        "MIN(CASE WHEN movimento.tipo = 'SAIDA' THEN movimento.data ELSE NULL END)",
        "dataPrimeiraSaida"
      )
      .where("movimento.insumo_id = :insumoId", { insumoId })
      .andWhere(
        "(movimento.tipo = 'SAIDA') OR movimento.tipoDocumento = 'ESTORNO_REQUISICAO'"
      )
      .groupBy("movimento.documentoOrigem")
      .orderBy("data", "DESC")
      .limit(MAX_DOCUMENTOS_ORIGEM)
      .getRawMany();

    if (documentosComMovimentacoes.length === 0) {
      await this.atualizarEstoqueComConsumoZero(manager, estoque);
      return;
    }

    // Filtrar documentos válidos (onde saídas - estornos > 0)
    const documentosValidos = documentosComMovimentacoes.filter(
      (doc) => Number(doc.totalSaidas) - Number(doc.totalEstornos) > 0
    );

    if (documentosValidos.length === 0) {
      await this.atualizarEstoqueComConsumoZero(manager, estoque);
      return;
    }

    // Encontrar a data mais antiga entre as movimentações válidas
    const datasMinimasValidas = documentosValidos
      .map((doc) => doc.dataPrimeiraSaida)
      .filter((data) => data !== null);

    if (datasMinimasValidas.length === 0) {
      await this.atualizarEstoqueComConsumoZero(manager, estoque);
      return;
    }

    const dataInicial = new Date(
      Math.min(...datasMinimasValidas.map((data) => new Date(data).getTime()))
    );
    const dataFinal = new Date();
    const diferencaMs = dataFinal.getTime() - dataInicial.getTime();
    const periodoDias = Math.max(1, diferencaMs / (1000 * 60 * 60 * 24));

    // Calcular o total de saídas líquidas (saídas - estornos)
    const totalSaidas = documentosValidos.reduce((soma, doc) => {
      const saidaLiquida = Number(doc.totalSaidas) - Number(doc.totalEstornos);
      return soma + saidaLiquida;
    }, 0);

    const consumoMedioDiario = totalSaidas / periodoDias;

    console.log(
      `Consumo médio diário do insumo ${insumoId} ${consumoMedioDiario} \n total saídas ${totalSaidas} \n período ${periodoDias} dias`
    );

    // Atualizar o estoque
    estoque.consumoMedioDiario = consumoMedioDiario;
    estoque.ultimaAtualizacaoConsumo = new Date();
    await manager.save(Estoque, estoque);
  },

  async atualizarEstoqueComConsumoZero(
    manager: EntityManager,
    estoque: Estoque
  ): Promise<void> {
    estoque.consumoMedioDiario = 0;
    estoque.ultimaAtualizacaoConsumo = new Date();
    await manager.save(Estoque, estoque);
  },
};
