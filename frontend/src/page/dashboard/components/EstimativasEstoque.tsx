import {
  Box,
  Chip,
  debounce,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import DashboardCard from "../../../components/cards/DashboardCard";
import { useEstoqueQueries } from "../../../hooks/queries/useEstoqueQueries";
import { useEntityChangeSocket } from "../../../hooks/useEntityChangeSocket";
import { formatDateBR } from "../../../util/formatDateBR";

export const EstimativasEstoque = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [filters, setFilters] = useState({
    insumo: "",
  });

  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, insumo: value }));
        // Volta para a primeira página quando filtra
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => {
      debouncedSearch.clear();
    };
  }, [searchInput, debouncedSearch]);

  const isSocketConnected = useEntityChangeSocket("estoque");

  const { useGetAllPaginated: useGetEstoquesPaginated } = useEstoqueQueries();

  const { data } = useGetEstoquesPaginated(
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      filters,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    }
  );
  return (
    <DashboardCard
      title="Estimativas de estoque"
      action={
        <>
          <TextField
            label="Filtrar por insumo"
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </>
      }
    >
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            mt: 2,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Insumo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Consumo médio diário
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Abaixo do estoque mínimo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Dias restantes
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Previsão estoque mínimo
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Previsão fim de estoque
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.content.map((item) => (
              <TableRow key={item.insumo.id}>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.insumo.descricao}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{
                          fontSize: "13px",
                        }}
                      >
                        {item.insumo.categoria.nome}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {item.consumoMedioDiario}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        sx={{
                          fontSize: "13px",
                        }}
                      >
                        {item.insumo.undEstoque}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {item.abaixoMinimo ? (
                    <Chip
                      sx={{
                        px: "4px",
                        backgroundColor: "#fdede8",
                        color: "#FA896B",
                      }}
                      size="small"
                      label="Sim"
                    ></Chip>
                  ) : (
                    <Chip
                      sx={{
                        px: "4px",
                      }}
                      size="small"
                      label="Não"
                    ></Chip>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">{item.diasRestantes}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    {formatDateBR(item.previsaoEstoqueMinimo)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    {formatDateBR(item.previsaoFimEstoque)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.totalElements || 0}
          rowsPerPage={paginationModel.pageSize}
          page={paginationModel.page}
          onPageChange={(_, newPage) => {
            setPaginationModel({
              ...paginationModel,
              page: newPage,
            });
          }}
          onRowsPerPageChange={(e) => {
            setPaginationModel({
              ...paginationModel,
              pageSize: parseInt(e.target.value, 10),
            });
          }}
        />
      </Box>
    </DashboardCard>
  );
};
