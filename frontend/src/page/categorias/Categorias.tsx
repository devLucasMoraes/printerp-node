import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useCategoriaQueries } from "../../hooks/queries/useCategoriaQueries";
import { useAlertStore } from "../../stores/useAlertStore";

import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { useEntityChangeSocket } from "../../hooks/useEntityChangeSocket";
import { CategoriaDto } from "../../types";
import { CategoriaModal } from "./components/CategoriaModal";

const Categorias = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedCategoria, setSelectedCategoria] = useState<{
    data: CategoriaDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const isSocketConnected = useEntityChangeSocket(
    "categoria",
    {
      // Quando categoria mudar, invalida insumos
      invalidate: ["insumo"],
    },
    {
      showNotifications: true,
      entityLabel: "Categoria",
      suppressSocketAlert: formOpen || confirmModalOpen,
    }
  );

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetCategoriasPaginated,
    useDelete: useDeleteCategoria,
  } = useCategoriaQueries();

  const { data, isLoading } = useGetCategoriasPaginated(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    }
  );
  const { mutate: deleteById } = useDeleteCategoria();

  const handleConfirmDelete = (categoria: CategoriaDto) => {
    setSelectedCategoria({ data: categoria, type: "DELETE" });
    setConfirmModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        setSelectedCategoria(undefined);
        setConfirmModalOpen(false);
        showAlert("Categoria deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (categoria: CategoriaDto) => {
    setSelectedCategoria({ data: categoria, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCopy = (categoria: CategoriaDto): void => {
    setSelectedCategoria({ data: categoria, type: "COPY" });
    setFormOpen(true);
  };

  const columns: GridColDef<CategoriaDto>[] = [
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
      <CategoriaModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedCategoria(undefined);
        }}
        categoria={selectedCategoria}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedCategoria(undefined);
        }}
        onConfirm={() => {
          if (!selectedCategoria) return;
          handleDelete(selectedCategoria.data.id);
        }}
        title="Deletar categoria"
      >
        Tem certeza que deseja deletar essa categoria?
      </ConfirmationModal>
    </>
  );

  return (
    <PageContainer title="Categorias" description="">
      {renderModals()}
      <DashboardCard
        title="Categorias"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar categoria
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

export default Categorias;
