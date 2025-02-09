import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { profiles } from "../../../constants";
import { useUserQueries } from "../../../hooks/queries/useUserQueries";
import {
  userCreateSchema,
  UserDto,
  userUpdateSchema,
} from "../../../schemas/user.schemas";
import { useAlertStore } from "../../../stores/useAlertStore";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user?: UserDto;
}

export const UserModal = ({ open, onClose, user }: UserModalProps) => {
  const { showAlert } = useAlertStore((state) => state);

  const schema = user ? userUpdateSchema : userCreateSchema;

  const { useCreate: useCreateUser, useUpdate: useUpdateUser } =
    useUserQueries();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      profile: "user",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        name: user.name,
        email: user.email,
        password: "",
        profile: user.profile,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        profile: "user",
      });
    }
  }, [user, reset]);

  const { mutate: createUser } = useCreateUser();

  const { mutate: updateUser } = useUpdateUser();

  const onSubmit = (data: UserDto) => {
    if (user) {
      updateUser(
        { id: user.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            showAlert("Usuário atualizado com sucesso", "success");
          },
          onError: (error) => {
            console.error(error);
            showAlert(error.response?.data.message || error.message, "error");
          },
        }
      );
    } else {
      createUser(data, {
        onSuccess: () => {
          onClose();
          reset();
          showAlert("Usuário criado com sucesso", "success");
        },
        onError: (error) => {
          console.error(error);
          showAlert(error.response?.data.message || error.message, "error");
        },
      });
    }
  };
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>{user ? "Editar" : "Novo"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {user
            ? "Preencha os campos abaixo para editar o usuário"
            : "Preencha os campos abaixo para criar um novo usuário"}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Senha"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size="grow">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size="auto">
            <Controller
              name="profile"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Perfil"
                  error={!!errors.profile}
                  helperText={errors.profile?.message}
                  fullWidth
                  select
                >
                  {profiles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
