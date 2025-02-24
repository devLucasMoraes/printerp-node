import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useEquipamentoQueries } from "../../hooks/queries/useEquipamentoQueries";
import { useEntityChangeSocket } from "../../hooks/useEntityChangeSocket";
import { useAlertStore } from "../../stores/useAlertStore";
import { EquipamentoDto } from "../../types";
import { EquipamentoModal } from "./components/EquipamentoModal";

const Equipamentos = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedEquipamento, setSelectedEquipamento] = useState<{
    data: EquipamentoDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const isSocketConnected = useEntityChangeSocket(
    "equipamento",
    {
      invalidate: ["requisicaoEstoque"],
    },
    {
      showNotifications: true,
      entityLabel: "Equipamento",
      suppressSocketAlert: formOpen || confirmModalOpen,
    }
  );

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetEquipamentosPaginated,
    useDelete: useDeleteEquipamento,
  } = useEquipamentoQueries();

  const { data, isLoading } = useGetEquipamentosPaginated(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    }
  );
  const { mutate: deleteById } = useDeleteEquipamento();

  const handleConfirmDelete = (equipamento: EquipamentoDto) => {
    setSelectedEquipamento({ data: equipamento, type: "DELETE" });
    setConfirmModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        showAlert("Equipamento deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (equipamento: EquipamentoDto) => {
    setSelectedEquipamento({ data: equipamento, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCopy = (equipamento: EquipamentoDto): void => {
    setSelectedEquipamento({ data: equipamento, type: "COPY" });
    setFormOpen(true);
  };

  const columns: GridColDef<EquipamentoDto>[] = [
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
      <EquipamentoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedEquipamento(undefined);
        }}
        equipamento={selectedEquipamento}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedEquipamento(undefined);
        }}
        onConfirm={() => {
          if (!selectedEquipamento) return;
          handleDelete(selectedEquipamento.data.id);
        }}
        title="Deletar equipamento"
      >
        Tem certeza que deseja deletar esse equipamento?
      </ConfirmationModal>
    </>
  );

  return (
    <PageContainer title="Equipamentos" description="">
      {renderModals()}
      <DashboardCard
        title="Equipamentos"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar equipamento
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

export default Equipamentos;
