import { Avatar, Fab, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import Chart from "react-apexcharts";
import DashboardCard from "../../../components/cards/DashboardCard";
import { useChartsQueries } from "../../../hooks/queries/useChartsQueries";
import { useEntityChangeSocket } from "../../../hooks/useEntityChangeSocket";

const SaidasMensais = () => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";
  const successlight = theme.palette.success.light;

  const isSocketConnected = useEntityChangeSocket(
    "charts",
    { dependsOn: ["requisicaoEstoque"] },
    { showNotifications: false }
  );

  const { chartSaidasMensais } = useChartsQueries();

  const { data } = chartSaidasMensais({
    staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
  });

  // chart
  const optionscolumnchart: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
    xaxis: {
      categories: data?.xaxisData || [],
    },
  };
  const seriescolumnchart = [
    {
      name: "R$",
      color: secondary,
      data: data?.seriesData || [],
    },
  ];

  return (
    <DashboardCard
      title="Saídas Mensais"
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height="60px"
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {data?.total
            ? data.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "R$ 0,00"}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          {data?.percentual && data.percentual === 0 ? (
            ""
          ) : data?.percentual && data?.percentual < 0 ? (
            <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
              <IconArrowDownRight width={20} color="#FA896B" />
            </Avatar>
          ) : (
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpRight width={20} color="#39B69A" />
            </Avatar>
          )}
          <Typography variant="subtitle2" fontWeight="600">
            {`${data?.percentual || 0} %`}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            ano passado
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default SaidasMensais;
