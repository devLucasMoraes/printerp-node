import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useInsumoQueries } from "../../hooks/queries/useInsumoQueries";
import { useAlertStore } from "../../stores/useAlertStore";
import { InsumoDto } from "../../types";
import { InsumoModal } from "./components/InsumoModal";

const Insumos = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<{
    data: InsumoDto;
    type: "UPDATE" | "COPY" | "CREATE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetInsumosPaginated,
    useDelete: useDeleteInsumo,
  } = useInsumoQueries();

  const { data, isLoading } = useGetInsumosPaginated({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const { mutate: deleteById } = useDeleteInsumo();

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
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
      <InsumoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedInsumo(undefined);
        }}
        insumo={selectedInsumo}
      />
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
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default Insumos;
