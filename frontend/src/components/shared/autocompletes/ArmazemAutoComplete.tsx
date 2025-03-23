import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useArmazemQueries } from "../../../hooks/queries/useArmazemQueries";
import { ArmazemDto } from "../../../types";

type FieldProps = {
  field: {
    value: ArmazemDto | null;
    onChange: (value: ArmazemDto | null) => void;
    onBlur: () => void;
    name: string;
  };
  error?: {
    message?: string;
  };
};

export const ArmazemAutoComplete = ({ field, error }: FieldProps) => {
  const { useGetAll: useGetAllArmazems } = useArmazemQueries();
  const { data: armazens = [], isLoading } = useGetAllArmazems();

  const options = [...armazens];

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
          label="Armazem"
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
