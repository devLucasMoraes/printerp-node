import { EntityManager } from "typeorm";
import { Estoque } from "../../entities/Estoque";

const MAX_DATAS_RECENTES = 10;

interface QueryResult {
  documento_origem: string;
  data: Date;
  total_saidas: number;
  total_estornos: number;
  saida_liquida: number;
}

export const atualizarConsumoMedioDiarioUseCase = {
  async execute(
    insumoId: number,
    armazemId: number,
    manager: EntityManager,
    forcarAtualizacao: boolean = true
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

    // Consulta otimizada
    const resultado: QueryResult[] = await manager.query(
      `
        WITH latest_por_documento AS (
        -- 1) Para cada documento_origem, escolhe o movimento SAÍDA com o updated_at mais recente
        SELECT DISTINCT ON (me.documento_origem)
          me.documento_origem,
          me.data           AS ultima_data,
          me.updated_at
        FROM movimentos_estoque me
        WHERE me.insumo_id = $1
          AND me.tipo = 'SAIDA'
          AND me.tipo_documento = 'REQUISICAO'  -- Adicionado filtro para tipo_documento
        ORDER BY me.documento_origem,
                  me.updated_at DESC
        ),
        datas_recentes AS (
        -- 2) Pega as 10 datas distintas mais recentes, a partir da ultima_data de cada documento
        SELECT DISTINCT
          DATE(ultima_data) AS data
        FROM latest_por_documento
        ORDER BY DATE(ultima_data) DESC
        LIMIT ${MAX_DATAS_RECENTES}
        ),
        docs_filtrados AS (
        -- 3) Filtra somente os documentos cujas ultimas datas estão nessas 10 datas
        SELECT
          lpd.documento_origem,
          lpd.ultima_data
        FROM latest_por_documento lpd
        WHERE DATE(lpd.ultima_data) IN (
          SELECT data FROM datas_recentes
        )
        ),
        estatisticas_por_documento AS (
        -- 4) Agora calcula as estatísticas para todos os movimentos desses documentos
        SELECT
          d.documento_origem,
          d.ultima_data     AS data,
          SUM(CASE WHEN me.tipo = 'SAIDA'   THEN me.quantidade ELSE 0 END) AS total_saidas,
          SUM(CASE WHEN me.estorno = 'true' THEN me.quantidade ELSE 0 END) AS total_estornos,
          -- saída líquida
          (SUM(CASE WHEN me.tipo = 'SAIDA'   THEN me.quantidade ELSE 0 END)
            - SUM(CASE WHEN me.estorno = 'true' THEN me.quantidade ELSE 0 END)
          ) AS saida_liquida
        FROM movimentos_estoque me
          JOIN docs_filtrados d
            ON me.documento_origem = d.documento_origem
        WHERE me.insumo_id = $1
          AND (me.tipo = 'SAIDA' OR me.estorno = 'true')
          AND me.tipo_documento = 'REQUISICAO'  -- Adicionado filtro aqui também
        GROUP BY d.documento_origem, d.ultima_data
        HAVING
          -- somente documentos com saída líquida positiva
          (SUM(CASE WHEN me.tipo = 'SAIDA'   THEN me.quantidade ELSE 0 END)
            - SUM(CASE WHEN me.estorno = 'true' THEN me.quantidade ELSE 0 END)
          ) > 0
        )
        SELECT
        documento_origem,
        data,
        total_saidas,
        total_estornos,
        saida_liquida
        FROM estatisticas_por_documento
        ORDER BY data DESC, documento_origem;
    `,
      [insumoId]
    );

    if (!resultado || resultado.length === 0) {
      await this.atualizarEstoqueComConsumoZero(manager, estoque);
      return;
    }

    // Calcular o período em dias
    const datasDocumentos = resultado.map((doc) => new Date(doc.data));
    const dataInicial = new Date(
      Math.min(...datasDocumentos.map((d) => d.getTime()))
    );
    const dataFinal = new Date();

    // Truncar as horas para calcular dias completos
    const dataInicialSemHora = new Date(
      dataInicial.getFullYear(),
      dataInicial.getMonth(),
      dataInicial.getDate()
    );
    const dataFinalSemHora = new Date(
      dataFinal.getFullYear(),
      dataFinal.getMonth(),
      dataFinal.getDate()
    );

    // Adicionar 1 para incluir ambos os dias (inicial e final) na contagem
    const periodoDias =
      Math.ceil(
        (dataFinalSemHora.getTime() - dataInicialSemHora.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    // Calcular o total de saídas líquidas
    const totalSaidas = resultado.reduce(
      (soma, doc) => soma + Number(doc.saida_liquida),
      0
    );

    const consumoMedioDiario = totalSaidas / periodoDias;

    console.log(
      `\nConsumo médio diário do insumo ${insumoId} ${consumoMedioDiario} \n total saídas ${totalSaidas} \n período ${periodoDias} dias`
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
