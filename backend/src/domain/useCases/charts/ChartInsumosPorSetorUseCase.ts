import { appDataSource } from "../../../database";
import { InsumosPorSetorResponse } from "../../services/ChartsService";

interface DadoInsumoSetor {
  setor_id: number;
  setor_nome: string;
  insumo_id: number;
  insumo_descricao: string;
  valor_total: string; // Vem como string do banco
}

export const chartInsumosPorSetorUseCase = {
  async execute(periodo: number = 1): Promise<InsumosPorSetorResponse> {
    const manager = appDataSource.manager;

    // Determinar o período com base no parâmetro
    const periodoMap: Record<
      number,
      { intervalo: string; usaMesIncompleto: boolean }
    > = {
      1: { intervalo: "1 month", usaMesIncompleto: true }, // 1 mês (atual incompleto)
      2: { intervalo: "90 days", usaMesIncompleto: false }, // 3 meses (90 dias)
      3: { intervalo: "180 days", usaMesIncompleto: false }, // 6 meses (180 dias)
    };

    const periodoConfig = periodoMap[periodo] || periodoMap[1]; // Default para 1 mês

    // Monta a condição de data dinamicamente
    const condicaoData = periodoConfig.usaMesIncompleto
      ? `re.data_requisicao >= DATE_TRUNC('month', CURRENT_DATE)`
      : `re.data_requisicao >= CURRENT_DATE - INTERVAL '${periodoConfig.intervalo}'`;

    const insumosPorSetorQuery = `
  SELECT
      s.id AS setor_id,
      s.nome AS setor_nome,
      i.id AS insumo_id,
      i.descricao AS insumo_descricao,
      SUM(rei.quantidade * rei.valor_unitario) AS valor_total
  FROM
      requisicoes_estoque re
      INNER JOIN requisicoes_estoque_itens rei ON re.id = rei.requisicoes_estoque_id
      INNER JOIN insumos i ON rei.insumos_id = i.id
      INNER JOIN setores s ON re.setor_id = s.id
  WHERE
      re.deleted_at IS NULL
      AND rei.deleted_at IS NULL
      AND i.deleted_at IS NULL
      AND s.deleted_at IS NULL
      -- Condição de data dinâmica
      AND ${condicaoData}
      AND re.data_requisicao < CURRENT_DATE + INTERVAL '1 day'  -- Até hoje
  GROUP BY
      s.id, s.nome, i.id, i.descricao
  ORDER BY valor_total DESC;
`;
    const dadosInsumoSetor: DadoInsumoSetor[] = await manager.query(
      insumosPorSetorQuery
    );

    // Obter lista única de setores ordenados por valor total
    const setoresPorTotal = dadosInsumoSetor
      .reduce((acc, item) => {
        const existing = acc.find((s) => s.id === item.setor_id);
        if (existing) {
          existing.total += parseFloat(item.valor_total || "0");
        } else {
          acc.push({
            id: item.setor_id,
            nome: item.setor_nome,
            total: parseFloat(item.valor_total || "0"),
          });
        }
        return acc;
      }, [] as Array<{ id: number; nome: string; total: number }>)
      .sort((a, b) => b.total - a.total);

    const setoresOrdenados = setoresPorTotal.map((item) => item.nome);

    // Obter lista única de insumos
    const insumosUnicos = Array.from(
      new Set(dadosInsumoSetor.map((item) => item.insumo_id))
    ).map((insumoId) => {
      const insumoItem = dadosInsumoSetor.find(
        (item) => item.insumo_id === insumoId
      );
      return {
        id: insumoId,
        descricao: insumoItem?.insumo_descricao || "",
      };
    });

    // Criar as séries de dados para todos os insumos
    const series = insumosUnicos.map((insumo) => {
      return {
        name: insumo.descricao,
        data: setoresOrdenados.map((setor) => {
          const item = dadosInsumoSetor.find(
            (dado) => dado.setor_nome === setor && dado.insumo_id === insumo.id
          );
          return item ? parseFloat(item.valor_total) : 0;
        }),
      };
    });

    // Calcular o total geral
    const totalGeral = dadosInsumoSetor.reduce(
      (total, item) => total + parseFloat(item.valor_total || "0"),
      0
    );

    return {
      xaxisData: setoresOrdenados,
      series: series,
      totalGeral: totalGeral,
    };
  },
};
