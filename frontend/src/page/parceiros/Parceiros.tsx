import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useParceiroQueries } from "../../hooks/queries/useParceiroQueries";
import { useAlertStore } from "../../stores/useAlertStore";

import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { useEntityChangeSocket } from "../../hooks/useEntityChangeSocket";
import { ParceiroDto } from "../../types";
import { ParceiroModal } from "./components/ParceiroModal";

const Parceiros = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedParceiro, setSelectedParceiro] = useState<{
    data: ParceiroDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const isSocketConnected = useEntityChangeSocket(
    "parceiro",
    {
      invalidate: ["requisicaoEstoque"],
    },
    {
      showNotifications: true,
      entityLabel: "Parceiro",
      suppressSocketAlert: formOpen || confirmModalOpen,
    }
  );

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetParceirosPaginated,
    useDelete: useDeleteParceiro,
  } = useParceiroQueries();

  const { data, isLoading } = useGetParceirosPaginated(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    }
  );
  const { mutate: deleteById } = useDeleteParceiro();

  const handleConfirmDelete = (parceiro: ParceiroDto) => {
    setSelectedParceiro({ data: parceiro, type: "DELETE" });
    setConfirmModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        setSelectedParceiro(undefined);
        setConfirmModalOpen(false);
        showAlert("Parceiro deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (parceiro: ParceiroDto) => {
    setSelectedParceiro({ data: parceiro, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCopy = (parceiro: ParceiroDto): void => {
    setSelectedParceiro({ data: parceiro, type: "COPY" });
    setFormOpen(true);
  };

  const columns: GridColDef<ParceiroDto>[] = [
    { field: "nome", headerName: "Nome", minWidth: 120, flex: 1 },
    { field: "fone", headerName: "Telefone", minWidth: 120, flex: 1 },
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
            onClick={() => handleConfirmDelete(params.row)}
          >
            <IconEraser />
          </IconButton>
        </>
      ),
    },
  ];

  const renderModals = () => (
    <>
      <ParceiroModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedParceiro(undefined);
        }}
        parceiro={selectedParceiro}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedParceiro(undefined);
        }}
        onConfirm={() => {
          if (!selectedParceiro) return;
          handleDelete(selectedParceiro.data.id);
        }}
        title="Deletar parceiro"
      >
        Tem certeza que deseja deletar esse parceiro?
      </ConfirmationModal>
    </>
  );

  return (
    <PageContainer title="Parceiros" description="">
      {renderModals()}
      <DashboardCard
        title="Parceiros"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar parceiro
          </Button>
        }
      >
        <ServerDataTable
          rows={data?.content || []}
          columns={columns}
          isLoading={isLoading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          totalRowCount={data?.totalElements}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default Parceiros;
