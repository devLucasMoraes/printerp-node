import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DashboardCard from "../../../components/cards/DashboardCard";

const estimativas = [
  {
    id: "1",
    insumo: {
      id: "1",
      descricao: "IPA 70/30",
      unidade: "LITRO",
      categoria: "ALCOÓIS",
    },
    abaixoMinimo: true,
    consumoMedioDiario: "1",
    diasRestantes: "30",
    pbg: "08/04/2025",
    previsaoEstoqueMinimo: "08/04/2025",
    previsaoFimEstoque: "08/04/2025",
  },
];

export const EstimativasEstoque = () => {
  return (
    <DashboardCard title="Estimativas de estoque">
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
            {estimativas.map((item) => (
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
                        {item.insumo.categoria}
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
                        {item.insumo.unidade}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      px: "4px",
                      backgroundColor: item.pbg,
                      color: "#fff",
                    }}
                    size="small"
                    label={item.abaixoMinimo ? "Sim" : "Nao"}
                  ></Chip>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">{item.diasRestantes}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    {item.previsaoEstoqueMinimo}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    {item.previsaoFimEstoque}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};
