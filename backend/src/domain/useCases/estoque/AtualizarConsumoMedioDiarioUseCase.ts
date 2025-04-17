import { EntityManager } from "typeorm";
import { Estoque } from "../../entities/Estoque";

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

    // Consulta otimizada
    const resultado = await manager.query(
      `
      WITH documentos_recentes AS (
        -- Selecionar os documentos mais recentes baseados na data de movimento
        SELECT DISTINCT ON (me.documento_origem) 
          me.documento_origem, 
          me.data
        FROM movimentos_estoque me
        WHERE me.insumo_id = $1 
          AND me.tipo = 'SAIDA'
        ORDER BY me.documento_origem, me.updated_at DESC
        LIMIT ${MAX_DOCUMENTOS_ORIGEM}
      ),
      estatisticas_por_documento AS (
        -- Calcular as estatísticas por documento
        SELECT 
          dr.documento_origem,
          dr.data,
          SUM(CASE WHEN me.tipo = 'SAIDA' THEN me.quantidade ELSE 0 END) as total_saidas,
          SUM(CASE WHEN me.estorno = 'true' THEN me.quantidade ELSE 0 END) as total_estornos,
          (SUM(CASE WHEN me.tipo = 'SAIDA' THEN me.quantidade ELSE 0 END) - 
           SUM(CASE WHEN me.estorno = 'true' THEN me.quantidade ELSE 0 END)) as saida_liquida
        FROM documentos_recentes dr
        JOIN movimentos_estoque me ON dr.documento_origem = me.documento_origem
        WHERE me.insumo_id = $1
          AND (me.tipo = 'SAIDA' OR me.estorno = 'true')
        GROUP BY dr.documento_origem, dr.data
        HAVING (SUM(CASE WHEN me.tipo = 'SAIDA' THEN me.quantidade ELSE 0 END) - 
                SUM(CASE WHEN me.estorno = 'true' THEN me.quantidade ELSE 0 END)) > 0
      )
      SELECT 
        documento_origem,
        data,
        total_saidas,
        total_estornos,
        saida_liquida
      FROM estatisticas_por_documento
      ORDER BY data DESC
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
