import { appDataSource } from "../../../database";
import { SaidasMensaisResponse } from "../../services/ChartsService";

interface DadoMensal {
  mes: Date;
  mes_numero: number;
  mes_nome: string;
  total: string; // Vem como string do banco
}

export const chartSaidasMensaisUseCase = {
  async execute(): Promise<SaidasMensaisResponse> {
    // Obtendo o manager diretamente
    const manager = appDataSource.manager;

    // 1. Consulta as saídas dos últimos 7 meses
    const ultimosSeteMesesQuery = `
      SELECT 
        DATE_TRUNC('month', data_requisicao) AS mes,
        EXTRACT(MONTH FROM data_requisicao) AS mes_numero,
        TO_CHAR(data_requisicao, 'Mon') AS mes_nome,
        SUM(valor_total) AS total
      FROM 
        requisicoes_estoque
      WHERE 
        data_requisicao >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
        AND data_requisicao < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
        AND deleted_at IS NULL
      GROUP BY 
        DATE_TRUNC('month', data_requisicao),
        EXTRACT(MONTH FROM data_requisicao),
        TO_CHAR(data_requisicao, 'Mon')
      ORDER BY 
        mes ASC
    `;

    const dadosMensais: DadoMensal[] = await manager.query(
      ultimosSeteMesesQuery
    );

    // 2. Consulta o mesmo mês do ano anterior para comparação percentual
    const mesAnteriorAnoPassadoQuery = `
      SELECT 
        COALESCE(SUM(valor_total), 0) AS total 
      FROM 
        requisicoes_estoque 
      WHERE 
        data_requisicao >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 year')
        AND data_requisicao < DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 year') + INTERVAL '1 month'
        AND deleted_at IS NULL
    `;

    const resultadoMesAnterior = await manager.query(
      mesAnteriorAnoPassadoQuery
    );
    const mesAnteriorAnoPassadoTotal = parseFloat(
      resultadoMesAnterior[0]?.total || "0"
    );

    // Extrair dados do mês atual (último da lista)
    const mesAtual = dadosMensais[dadosMensais.length - 1];
    const mesAtualTotal = parseFloat(mesAtual?.total || "0");

    // Calcular percentual de variação
    const percentual =
      mesAnteriorAnoPassadoTotal > 0
        ? Math.round(
            ((mesAtualTotal - mesAnteriorAnoPassadoTotal) /
              mesAnteriorAnoPassadoTotal) *
              100
          )
        : 0;

    // Mapear os nomes dos meses para português
    const mesesPtBR = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const xaxisData = dadosMensais.map((mes) => mesesPtBR[mes.mes_numero - 1]);
    const seriesData = dadosMensais.map((mes) => parseFloat(mes.total) || 0);

    return {
      total: mesAtualTotal,
      percentual,
      seriesData,
      xaxisData,
    };
  },
};
