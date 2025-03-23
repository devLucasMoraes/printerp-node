import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useSetorQueries } from "../../../hooks/queries/useSetorQueries";
import { SetorDto } from "../../../types";

type FieldProps = {
  field: {
    value: SetorDto | null;
    onChange: (value: SetorDto | null) => void;
    onBlur: () => void;
    name: string;
  };
  error?: {
    message?: string;
  };
};

export const SetorAutoComplete = ({ field, error }: FieldProps) => {
  const { useGetAll: useGetAllSetores } = useSetorQueries();
  const { data: equipamentos = [], isLoading } = useGetAllSetores();

  const options = [...equipamentos];

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
          label="Setor"
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
