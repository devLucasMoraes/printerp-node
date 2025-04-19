import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineOppositeContentClasses,
} from "@mui/lab";
import DashboardCard from "../../../components/cards/DashboardCard";

import { Link, Typography } from "@mui/material";

const movimentacoes = [
  {
    tipo: "ENTRADA",
    data: "2023-10-01",
    quantidade: 2,
    valor_unitario: 100.0,
    unidade: "UN",
    documento_origem: "10",
    tipo_documento_origem: "NFE",
    obs: "",
    user_id: "123",
    insumo: {
      id: 1,
      descricao: "Insumo A",
      unidade: "UN",
    },
  },
  {
    tipo: "SAIDA",
    data: "2023-10-01",
    quantidade: 2,
    valor_unitario: 100.0,
    unidade: "UN",
    documento_origem: "10",
    tipo_documento_origem: "REQUISICAO",
    obs: "",
    user_id: "123",
    insumo: {
      id: 1,
      descricao: "Insumo A",
      unidade: "UN",
    },
  },
  {
    tipo: "SAIDA",
    data: "2023-10-01",
    quantidade: 2,
    valor_unitario: 100.0,
    unidade: "UN",
    documento_origem: "10",
    tipo_documento_origem: "EMPRESTIMO",
    obs: "Venda de produtos",
    user_id: "123",
    insumo: {
      id: 1,
      descricao: "Insumo A",
      unidade: "UN",
    },
  },
  {
    tipo: "SAIDA",
    data: "2023-10-01",
    quantidade: 2,
    valor_unitario: 100.0,
    unidade: "UN",
    documento_origem: "10",
    tipo_documento_origem: "EMPRESTIMO",
    obs: "Venda de produtos",
    user_id: "123",
    insumo: {
      id: 1,
      descricao: "Insumo A",
      unidade: "UN",
    },
  },
  {
    tipo: "SAIDA",
    data: "2023-10-01",
    quantidade: 2,
    valor_unitario: 100.0,
    unidade: "UN",
    documento_origem: "10",
    tipo_documento_origem: "EMPRESTIMO",
    obs: "Venda de produtos",
    user_id: "123",
    insumo: {
      id: 1,
      descricao: "Insumo A",
      unidade: "UN",
    },
  },
];

const MovimentacoesRecentes = () => {
  return (
    <DashboardCard title="Movimentações recentes">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,

            "& .MuiTimelineConnector-root": {
              width: "1px",
              backgroundColor: "#efefef",
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          {movimentacoes.map((mov, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                <Typography noWrap>{mov.data}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    mov.tipo_documento_origem === "REQUISICAO"
                      ? "success"
                      : mov.tipo_documento_origem === "EMPRESTIMO"
                      ? "warning"
                      : "error"
                  }
                  variant="outlined"
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography fontWeight="600">
                  {`saída de ${mov.quantidade} ${mov.unidade} do ${
                    mov.insumo.descricao
                  } valor total de R$ ${(
                    mov.quantidade * mov.valor_unitario
                  ).toFixed(2)}`}
                </Typography>
                <Link href="/" underline="none">
                  {mov.tipo_documento_origem}-{mov.documento_origem}
                </Link>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default MovimentacoesRecentes;
