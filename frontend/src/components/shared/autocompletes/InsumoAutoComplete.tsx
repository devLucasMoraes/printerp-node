import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useInsumoQueries } from "../../../hooks/queries/useInsumoQueries";
import { InsumoDto } from "../../../types";

type FieldProps = {
  size?: "small" | "medium";
  field: {
    value: InsumoDto | null;
    onChange: (value: InsumoDto | null) => void;
    onBlur: () => void;
    name: string;
  };
  error?: {
    message?: string;
  };
};

export const InsumoAutoComplete = ({
  field,
  error,
  size = "medium",
}: FieldProps) => {
  const { useGetAll: useGetAllInsumos } = useInsumoQueries();
  const { data: insumos = [], isLoading } = useGetAllInsumos();

  const options = [...insumos];

  return (
    <Autocomplete
      value={field.value}
      id="insumo-select"
      options={options}
      getOptionLabel={(option) => option.descricao}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => newValue && field.onChange(newValue)}
      size={size}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          label="Insumo"
          autoFocus
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
