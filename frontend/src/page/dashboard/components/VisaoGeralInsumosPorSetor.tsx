import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../../../components/cards/DashboardCard";
import { useChartsQueries } from "../../../hooks/queries/useChartsQueries";
import { useEntityChangeSocket } from "../../../hooks/useEntityChangeSocket";

const VisaoGeralInsumosPorSetor = () => {
  const [period, setPeriod] = useState("1");
  const theme = useTheme();

  // Socket para revalidação em tempo real
  const isSocketConnected = useEntityChangeSocket(
    "charts",
    { dependsOn: ["requisicaoEstoque", "requisicaoEstoqueItem"] },
    { showNotifications: false }
  );

  // Usar React Query para gerenciar estado e cache
  const { chartInsumosPorSetor } = useChartsQueries();

  const { data } = chartInsumosPorSetor(period, {
    staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
  });

  const handleChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  // Definição das cores para cada insumo
  // Estas cores serão associadas a cada série de dados (insumo)
  const insumoColors = [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560",
    "#775DD0",
    "#3F51B5",
    "#03A9F4",
    "#4CAF50",
    "#F9CE1D",
    "#FF9800",
    "#9C27B0",
    "#673AB7",
    "#E91E63",
    "#CDDC39",
    "#2196F3",
  ];

  // chart
  const optionscolumnchart: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
      stacked: true,
    },
    colors: insumoColors.slice(0, data?.series?.length || 0),
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    stroke: {
      show: false,
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: function (value) {
          // Formatar valores para moeda brasileira
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);
        },
      },
    },
    xaxis: {
      categories: data?.xaxisData || [],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
      y: {
        formatter: function (value) {
          // Formatar valores para moeda brasileira no tooltip
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value);
        },
      },
    },
  };

  return (
    <DashboardCard
      title="Consumo de Insumos por Setor"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={period}
          size="small"
          onChange={handleChange}
        >
          <MenuItem value={"1"}>Mês Atual</MenuItem>
          <MenuItem value={"2"}>Últimos 3 Meses</MenuItem>
          <MenuItem value={"3"}>Últimos 6 Meses</MenuItem>
        </Select>
      }
    >
      {data && data.series && data.series.length > 0 ? (
        <Chart
          options={optionscolumnchart}
          series={data.series}
          type="bar"
          height="370px"
        />
      ) : (
        <div
          style={{
            height: "370px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#adb0bb",
          }}
        >
          Nenhum dado disponível para o período selecionado
        </div>
      )}
    </DashboardCard>
  );
};

export default VisaoGeralInsumosPorSetor;
