import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useRequisicaoEstoqueQueries } from "../../hooks/queries/useRequisicaoEstoqueQueries";
import { useAlertStore } from "../../stores/useAlertStore";
import { RequisicaoEstoqueDto } from "../../types";
import { RequisicaoEstoqueModal } from "./components/RequisicaoEstoqueModal";

const RequisicoesEstoque = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRequisicaoEstoque, setSelectedRequisicaoEstoque] =
    useState<RequisicaoEstoqueDto>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetRequisicoesEstoquePaginated,
    useDelete: useDeleteRequisicaoEstoque,
  } = useRequisicaoEstoqueQueries();

  const { data, isLoading } = useGetRequisicoesEstoquePaginated({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const { mutate: deleteById } = useDeleteRequisicaoEstoque();

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        showAlert("Requisição deletada com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (requisicao: RequisicaoEstoqueDto) => {
    setSelectedRequisicaoEstoque(requisicao);
    setFormOpen(true);
  };

  const columns: GridColDef<RequisicaoEstoqueDto>[] = [
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
      <RequisicaoEstoqueModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedRequisicaoEstoque(undefined);
        }}
        requisicao={selectedRequisicaoEstoque}
      />
    </>
  );

  return (
    <PageContainer title="Requisições de Estoque" description="">
      {renderModals()}
      <DashboardCard
        title="Requisições de Estoque"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            nova requisição
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

export default RequisicoesEstoque;
