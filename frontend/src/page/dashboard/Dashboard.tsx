import { Box, Grid } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

// components
import Blog from "./components/Blog";
import MonthlyEarnings from "./components/MonthlyEarnings";
import ProductPerformance from "./components/ProductPerformance";
import RecentTransactions from "./components/RecentTransactions";
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
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
