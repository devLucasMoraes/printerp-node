import { Typography } from "@mui/material";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";

const Emprestimos = () => {
  return (
    <PageContainer title="Empréstimos" description="">
      <DashboardCard title="Empréstimos">
        <Typography>emprestimos page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default Emprestimos;
