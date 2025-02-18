import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useArmazemQueries } from "../../hooks/queries/useArmazemQueries";
import { useAlertStore } from "../../stores/useAlertStore";

import { ArmazemDto } from "../../types";
import { ArmazemModal } from "./components/ArmazemModal";

const Armazens = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedArmazem, setSelectedArmazem] = useState<{
    data: ArmazemDto;
    type: "UPDATE" | "COPY" | "CREATE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetArmazensPaginated,
    useDelete: useDeleteArmazem,
  } = useArmazemQueries();

  const { data, isLoading } = useGetArmazensPaginated({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const { mutate: deleteById } = useDeleteArmazem();

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        showAlert("Armazém deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (armazem: ArmazemDto) => {
    setSelectedArmazem({ data: armazem, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCopy = (armazem: ArmazemDto): void => {
    setSelectedArmazem({ data: armazem, type: "COPY" });
    setFormOpen(true);
  };

  const columns: GridColDef<ArmazemDto>[] = [
    { field: "nome", headerName: "Nome", minWidth: 120, flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      minWidth: 130,
      flex: 0.1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleCopy(params.row)}
          >
            <IconCopy />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleEdit(params.row)}
          >
            <IconEdit />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleDelete(params.row.id)}
          >
            <IconEraser />
          </IconButton>
        </>
      ),
    },
  ];

  const renderModals = () => (
    <>
      <ArmazemModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedArmazem(undefined);
        }}
        armazem={selectedArmazem}
      />
    </>
  );

  return (
    <PageContainer title="Armazéns" description="">
      {renderModals()}
      <DashboardCard
        title="Armazéns"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar armazém
          </Button>
        }
      >
        <ServerDataTable
          rows={data?.content || []}
          columns={columns}
          isLoading={isLoading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default Armazens;
