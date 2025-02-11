import { Box, Card, Grid, Stack, Typography, styled } from "@mui/material";
import { Link } from "react-router";
import PageContainer from "../../components/container/PageContainer";
import Logo from "../../layouts/full/shared/logo/Logo";
import AuthLogin from "./auth/AuthLogin";

// Styled Components
const StyledRoot = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: "100vh",
  overflow: "hidden",
  "&:before": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    background: `radial-gradient(circle at top left, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite",
    opacity: theme.palette.mode === "dark" ? 0.15 : 0.1,
  },
  "@keyframes gradient": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "500px",
  backdropFilter: "blur(20px)",
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(180deg, ${theme.palette.background.paper}f0, ${theme.palette.background.paper}e8)`
      : `linear-gradient(180deg, ${theme.palette.background.paper}f8, ${theme.palette.background.paper}f0)`,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.7)"
  }`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.4)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 40px rgba(0, 0, 0, 0.5)"
        : "0 12px 40px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
  fontWeight: 500,
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const Login = () => {
  return (
    <PageContainer title="Login" description="this is Login page">
      <StyledRoot>
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <StyledCard elevation={0}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <Box mt={4}>
                <Typography
                  variant="h5"
                  textAlign="center"
                  color="textPrimary"
                  gutterBottom
                  fontWeight="500"
                >
                  Bem-vindo de volta!
                </Typography>
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  color="textSecondary"
                  mb={4}
                >
                  Entre com sua conta Printerp
                </Typography>

                <AuthLogin />

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  mt={4}
                >
                  <Typography color="textSecondary" variant="body1">
                    Novo no Printerp?
                  </Typography>
                  <StyledLink to="/auth/register">Crie sua conta</StyledLink>
                </Stack>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </StyledRoot>
    </PageContainer>
  );
};

export default Login;
