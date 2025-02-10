import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useRequisitanteQueries } from "../../hooks/queries/useRequisitanteQueries";
import { useAlertStore } from "../../stores/useAlertStore";

import { RequisitanteDto } from "../../types";
import { RequisitanteModal } from "./components/RequisitanteModal";

const Requisitantes = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRequisitante, setSelectedRequisitante] =
    useState<RequisitanteDto>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetRequisitantesPaginated,
    useDelete: useDeleteRequisitante,
  } = useRequisitanteQueries();

  const { data, isLoading } = useGetRequisitantesPaginated({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const { mutate: deleteById } = useDeleteRequisitante();

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        showAlert("Requisitante deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (requisitante: RequisitanteDto) => {
    setSelectedRequisitante(requisitante);
    setFormOpen(true);
  };

  const columns: GridColDef<RequisitanteDto>[] = [
    { field: "nome", headerName: "Nome", minWidth: 120, flex: 1 },
    { field: "fone", headerName: "Telefone", minWidth: 120, flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      minWidth: 120,
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
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
      <RequisitanteModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedRequisitante(undefined);
        }}
        requisitante={selectedRequisitante}
      />
    </>
  );

  return (
    <PageContainer title="Requisitantes" description="">
      {renderModals()}
      <DashboardCard
        title="Requisitantes"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar requisitante
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

export default Requisitantes;
