import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useParceiroQueries } from "../../../hooks/queries/useParceiroQueries";
import { ParceiroDto } from "../../../types";

type FieldProps = {
  field: {
    value: ParceiroDto | null;
    onChange: (value: ParceiroDto | null) => void;
    onBlur: () => void;
    name: string;
  };
  error?: {
    message?: string;
  };
};

export const ParceiroAutoComplete = ({ field, error }: FieldProps) => {
  const { useGetAll: useGetAllParceiros } = useParceiroQueries();
  const { data: parceiros = [], isLoading } = useGetAllParceiros();

  const options = [...parceiros];

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
          label="Parceiro"
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
