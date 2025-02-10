import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useCategoriaQueries } from "../../hooks/queries/useCategoriaQueries";
import { useAlertStore } from "../../stores/useAlertStore";

import { CategoriaDto } from "../../types";
import { CategoriaModal } from "./components/CategoriaModal";

const Categorias = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaDto>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetCategoriasPaginated,
    useDelete: useDeleteCategoria,
  } = useCategoriaQueries();

  const { data, isLoading } = useGetCategoriasPaginated({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const { mutate: deleteById } = useDeleteCategoria();

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        showAlert("Categoria deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (categoria: CategoriaDto) => {
    setSelectedCategoria(categoria);
    setFormOpen(true);
  };

  const columns: GridColDef<CategoriaDto>[] = [
    { field: "nome", headerName: "Nome", minWidth: 120, flex: 1 },
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
      <CategoriaModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedCategoria(undefined);
        }}
        categoria={selectedCategoria}
      />
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
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default Categorias;
