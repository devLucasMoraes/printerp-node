import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useCategoriaQueries } from "../../../hooks/queries/useCategoriaQueries";
import { CategoriaDto } from "../../../types";

type FieldProps = {
  field: {
    value: CategoriaDto | null;
    onChange: (value: CategoriaDto | null) => void;
    onBlur: () => void;
    name: string;
  };
  error?: {
    message?: string;
  };
};

export const CategoriaAutoComplete = ({ field, error }: FieldProps) => {
  const { useGetAll: useGetAllCategorias } = useCategoriaQueries();
  const { data: categorias = [], isLoading } = useGetAllCategorias();

  const options = [...categorias];

  return (
    <Autocomplete
      value={field.value}
      id="categoria-select"
      options={options}
      getOptionLabel={(option) => option.nome}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => newValue && field.onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          label="Categoria"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};
