import { styled } from "@mui/material";
import { Link } from "react-router";
import LogoDark1 from "/assets/images/logos/dark1-logo.svg";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        height: "70px",
      }}
    >
      <img src={LogoDark1} alt="Logo" />
    </LinkStyled>
  );
};

export default Logo;
