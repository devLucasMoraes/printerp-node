import { Box, Grid } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

// components
import { EstimativasEstoque } from "./components/EstimativasEstoque";
import MovimentacoesRecentes from "./components/MovimentacoesRecentes";
import SaidasMensais from "./components/SaidasMensais";
import VisaoGeralInsumosPorSetor from "./components/VisaoGeralInsumosPorSetor";
import YearlyBreakup from "./components/YearlyBreakup";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <VisaoGeralInsumosPorSetor />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <SaidasMensais />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <MovimentacoesRecentes />
          </Grid>
          <Grid item xs={12} lg={8}>
            <EstimativasEstoque />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
