import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useRequisitanteQueries } from "../../../hooks/queries/useRequisitanteQueries";
import { RequisitanteDto } from "../../../types";

type FieldProps = {
  field: {
    value: RequisitanteDto | null;
    onChange: (value: RequisitanteDto | null) => void;
    onBlur: () => void;
    name: string;
  };
  error?: {
    message?: string;
  };
};

export const RequisitanteAutoComplete = ({ field, error }: FieldProps) => {
  const { useGetAll: useGetAllRequisitantes } = useRequisitanteQueries();
  const { data: requisitantes = [], isLoading } = useGetAllRequisitantes();

  const options = [...requisitantes];

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
          label="Requisitante"
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
