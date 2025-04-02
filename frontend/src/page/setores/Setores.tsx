import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useSetorQueries } from "../../hooks/queries/useSetorQueries";
import { useEntityChangeSocket } from "../../hooks/useEntityChangeSocket";
import { useAlertStore } from "../../stores/useAlertStore";
import { SetorDto } from "../../types";
import { SetorModal } from "./components/SetorModal";

const Setores = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedSetor, setSelectedSetor] = useState<{
    data: SetorDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const isSocketConnected = useEntityChangeSocket(
    "setor",
    {
      invalidate: ["requisicaoEstoque"],
    },
    {
      showNotifications: true,
      entityLabel: "setor",
      suppressSocketAlert: formOpen || confirmModalOpen,
    }
  );

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetSetoresPaginated,
    useDelete: useDeleteSetor,
  } = useSetorQueries();

  const { data, isLoading } = useGetSetoresPaginated(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    }
  );
  const { mutate: deleteById } = useDeleteSetor();

  const handleConfirmDelete = (setor: SetorDto) => {
    setSelectedSetor({ data: setor, type: "DELETE" });
    setConfirmModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        setSelectedSetor(undefined);
        setConfirmModalOpen(false);
        showAlert("Setor deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (setor: SetorDto) => {
    setSelectedSetor({ data: setor, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCopy = (setor: SetorDto): void => {
    setSelectedSetor({ data: setor, type: "COPY" });
    setFormOpen(true);
  };

  const columns: GridColDef<SetorDto>[] = [
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
      <SetorModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedSetor(undefined);
        }}
        setor={selectedSetor}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedSetor(undefined);
        }}
        onConfirm={() => {
          if (!selectedSetor) return;
          handleDelete(selectedSetor.data.id);
        }}
        title="Deletar setor"
      >
        Tem certeza que deseja deletar esse setor?
      </ConfirmationModal>
    </>
  );

  return (
    <PageContainer title="Setores" description="">
      {renderModals()}
      <DashboardCard
        title="Setores"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar setor
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

export default Setores;
