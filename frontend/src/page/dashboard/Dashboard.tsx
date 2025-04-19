import { Box, Grid } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

// components
import { EstimativasEstoque } from "./components/EstimativasEstoque";
import MovimetacoesRecentes from "./components/MonthlyEarnings";
import MovimentacoesRecentes from "./components/MovimentacoesRecentes";
import SalesOverview from "./components/SalesOverview";
import YearlyBreakup from "./components/YearlyBreakup";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MovimetacoesRecentes />
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
