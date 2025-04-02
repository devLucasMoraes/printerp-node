import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useInsumoQueries } from "../../hooks/queries/useInsumoQueries";
import { useEntityChangeSocket } from "../../hooks/useEntityChangeSocket";
import { useAlertStore } from "../../stores/useAlertStore";
import { InsumoDto } from "../../types";
import { InsumoModal } from "./components/InsumoModal";

const Insumos = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedInsumo, setSelectedInsumo] = useState<{
    data: InsumoDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const isSocketConnected = useEntityChangeSocket(
    "insumo",
    {
      // Insumo depende das mudanças em categoria
      dependsOn: ["categoria"],
    },
    {
      showNotifications: true,
      entityLabel: "Insumo",
      suppressSocketAlert: formOpen || confirmModalOpen,
    }
  );

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetInsumosPaginated,
    useDelete: useDeleteInsumo,
  } = useInsumoQueries();

  const { data, isLoading } = useGetInsumosPaginated(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    }
  );
  const { mutate: deleteById } = useDeleteInsumo();

  const handleConfirmDelete = (insumo: InsumoDto) => {
    setSelectedInsumo({ data: insumo, type: "DELETE" });
    setConfirmModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        setSelectedInsumo(undefined);
        setConfirmModalOpen(false);
        showAlert("Insumo deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (insumo: InsumoDto) => {
    setSelectedInsumo({ data: insumo, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCopy = (insumo: InsumoDto): void => {
    setSelectedInsumo({ data: insumo, type: "COPY" });
    setFormOpen(true);
  };

  const columns: GridColDef<InsumoDto>[] = [
    { field: "descricao", headerName: "Descrição", minWidth: 155, flex: 0.3 },
    {
      field: "valorUntMed",
      headerName: "Valor unitário",
      minWidth: 155,
      flex: 0.1,
    },
    {
      field: "undEstoque",
      headerName: "Unidade de estoque",
      minWidth: 220,
      flex: 0.2,
    },
    {
      field: "estoqueMinimo",
      headerName: "Estoque minimo",
      minWidth: 220,
      flex: 0.2,
    },
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
      <InsumoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedInsumo(undefined);
        }}
        insumo={selectedInsumo}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedInsumo(undefined);
        }}
        onConfirm={() => {
          if (!selectedInsumo) return;
          handleDelete(selectedInsumo.data.id);
        }}
        title="Deletar insumo"
      >
        Tem certeza que deseja deletar esse insumo?
      </ConfirmationModal>
    </>
  );

  return (
    <PageContainer title="Insumos" description="">
      {renderModals()}
      <DashboardCard
        title="Insumos"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar insumo
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

export default Insumos;
