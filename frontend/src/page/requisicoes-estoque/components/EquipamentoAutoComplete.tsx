import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEquipamentoQueries } from "../../../hooks/queries/useEquipamentoQueries";
import { EquipamentoDto } from "../../../types";

type FieldProps = {
  field: {
    value: EquipamentoDto | null;
    onChange: (value: EquipamentoDto | null) => void;
    onBlur: () => void;
    name: string;
  };
  error?: {
    message?: string;
  };
};

export const EquipamentoAutoComplete = ({ field, error }: FieldProps) => {
  const { useGetAll: useGetAllEquipamentos } = useEquipamentoQueries();
  const { data: equipamentos = [], isLoading } = useGetAllEquipamentos();

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
          label="Equipamento"
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
