import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { IconEdit, IconEraser } from "@tabler/icons-react";
import { useState } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { ServerDataTable } from "../../components/shared/ServerDataTable";
import { profiles } from "../../constants";
import { useUserQueries } from "../../hooks/queries/useUserQueries";
import { UserDto } from "../../schemas/user.schemas";
import { useAlertStore } from "../../stores/useAlertStore";
import { UserModal } from "./components/UserModal";

const Users = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto>();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { showAlert } = useAlertStore((state) => state);

  const { useGetAllPaginated: useGetUsersPaginated, useDelete: useDeleteUser } =
    useUserQueries();

  const { data, isLoading } = useGetUsersPaginated({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const { mutate: deleteById } = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteById(id, {
      onSuccess: () => {
        showAlert("Usuário deletado com sucesso", "success");
      },
      onError: (error) => {
        console.error(error);
        showAlert(error.message, "error");
      },
    });
  };

  const handleEdit = (user: UserDto) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const columns: GridColDef<UserDto>[] = [
    { field: "name", headerName: "Nome", minWidth: 120, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 120, flex: 1 },
    {
      field: "profile",
      headerName: "Perfil",
      minWidth: 120,
      flex: 1,
      valueFormatter: (_, row) => {
        return profiles.find((profile) => profile.value === row.profile)?.label;
      },
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
      <UserModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedUser(undefined);
        }}
        user={selectedUser}
      />
    </>
  );

  return (
    <PageContainer title="Usuários" description="">
      {renderModals()}
      <DashboardCard
        title="Usuários"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormOpen(true)}
          >
            adicionar usuário
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

export default Users;
