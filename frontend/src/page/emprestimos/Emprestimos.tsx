import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconEdit, IconEraser } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { useEmprestimoQueries } from "../../hooks/queries/useEmprestimosQueries";
import { useEntityChangeSocket } from "../../hooks/useEntityChangeSocket";
import { useAlertStore } from "../../stores/useAlertStore";
import { EmprestimoDto } from "../../types";
import { EmprestimoModal } from "./components/EmprestimoModal";

const Emprestimos = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedEmprestimo, setSelectedEmprestimo] = useState<{
    data?: EmprestimoDto;
    type: "UPDATE" | "COPY" | "CREATE" | "DELETE";
  }>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  const isSocketConnected = useEntityChangeSocket(
    "emprestimo",
    {
      invalidate: ["estoque"],
      dependsOn: ["parceiro", "insumo", "armazem"],
    },
    {
      showNotifications: true,
      entityLabel: "Empréstimo",
      suppressSocketAlert: formOpen || confirmModalOpen,
    }
  );

  const { showAlert } = useAlertStore((state) => state);

  const {
    useGetAllPaginated: useGetEmprestimos,
    useDelete: useDeleteEmprestimo,
  } = useEmprestimoQueries();

  const { data, isLoading } = useGetEmprestimos(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    }
  );

  const { mutate: deleteById } = useDeleteEmprestimo();

  const handleConfirmDelete = (emprestimo: EmprestimoDto) => {
    setSelectedEmprestimo({ data: emprestimo, type: "DELETE" });
    setConfirmModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteById(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["emprestimo"] });
        setSelectedEmprestimo(undefined);
        setConfirmModalOpen(false);
        showAlert("Empréstimo excluído com sucesso!", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (emprestimo: EmprestimoDto) => {
    setSelectedEmprestimo({ data: emprestimo, type: "UPDATE" });
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedEmprestimo({
      type: "CREATE",
    });
    setFormOpen(true);
  };

  const columns: GridColDef<EmprestimoDto>[] = [
    {
      field: "dataEmprestimo",
      headerName: "Emprestado em",
      minWidth: 155,
      flex: 0.3,
      type: "date",
      valueGetter: (value) => (value ? new Date(value) : ""),
    },
    {
      field: "tipo",
      headerName: "Tipo",
      minWidth: 155,
      flex: 0.3,
      valueGetter: (value) => (value ? value : ""),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 155,
      flex: 0.3,
      valueGetter: (value) => (value ? value : ""),
    },
    {
      field: "parceiro",
      headerName: "Empresa parceira",
      minWidth: 200,
      flex: 0.3,
      display: "flex",
      valueGetter: (_, row) => {
        if (!row.parceiro?.nome) {
          return "";
        }
        return row.parceiro.nome;
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
      <EmprestimoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedEmprestimo(undefined);
        }}
        emprestimo={selectedEmprestimo}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setSelectedEmprestimo(undefined);
        }}
        onConfirm={() => {
          if (!selectedEmprestimo?.data) return;
          handleDelete(selectedEmprestimo.data.id);
        }}
        title="Deletar Empréstimo"
      >
        Tem certeza que deseja deletar esse empréstimo?
      </ConfirmationModal>
    </>
  );

  return (
    <PageContainer title="Empréstimos" description="">
      {renderModals()}
      <DashboardCard
        title="Empréstimos"
        action={
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Novo empréstimo
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

export default Emprestimos;
