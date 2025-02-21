import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconCopy, IconEdit, IconEraser } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
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
  const [selectedRequisicaoEstoque, setSelectedRequisicaoEstoque] = useState<{
    data: RequisicaoEstoqueDto;
    type: "UPDATE" | "COPY" | "CREATE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const queryClient = useQueryClient();
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
        queryClient.invalidateQueries({ queryKey: ["ESTOQUE-KEY"] });
        showAlert("Requisição deletada com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (requisicaoEstoque: RequisicaoEstoqueDto) => {
    setSelectedRequisicaoEstoque({ data: requisicaoEstoque, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCopy = (requisicaoEstoque: RequisicaoEstoqueDto): void => {
    setSelectedRequisicaoEstoque({ data: requisicaoEstoque, type: "COPY" });
    setFormOpen(true);
  };

  const columns: GridColDef<RequisicaoEstoqueDto>[] = [
    {
      field: "dataRequisicao",
      headerName: "Requerido em",
      minWidth: 155,
      flex: 0.3,
      type: "date",
      valueGetter: (value) => (value ? new Date(value) : ""),
    },
    {
      field: "valorTotal",
      headerName: "Valor total",
      minWidth: 155,
      flex: 0.1,
    },
    {
      field: "requisitante",
      headerName: "Requisitante",
      minWidth: 200,
      flex: 0.3,
      display: "flex",
      valueGetter: (_, row) => {
        if (!row.requisitante?.nome) {
          return "";
        }
        return row.requisitante.nome;
      },
    },
    {
      field: "equipamento",
      headerName: "Equipamento",
      minWidth: 200,
      flex: 0.3,
      display: "flex",
      valueGetter: (_, row) => {
        if (!row.equipamento?.nome) {
          return "";
        }
        return row.equipamento.nome;
      },
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
      <RequisicaoEstoqueModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedRequisicaoEstoque(undefined);
        }}
        requisicaoEstoque={selectedRequisicaoEstoque}
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
