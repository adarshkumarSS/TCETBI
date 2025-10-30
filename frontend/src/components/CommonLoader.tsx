import React from "react";
import { styled } from "@mui/material/styles";

const StyledWrapper = styled("div")({
  backgroundColor: "black", // 🖤 dark background
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,

  ".loader": {
    position: "relative",
    width: "2.5em",
    height: "2.5em",
    transform: "rotate(165deg)",
  },
  ".loader:before, .loader:after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    display: "block",
    width: "0.5em",
    height: "0.5em",
    borderRadius: "0.25em",
    transform: "translate(-50%, -50%)",
  },

  ".loader:before": {
    animation: "beforeRed 2s infinite",
  },
  ".loader:after": {
    animation: "afterRed 2s infinite",
  },

  "@keyframes beforeRed": {
    "0%": {
      width: "0.5em",
      boxShadow:
        "1em -0.5em rgba(255, 0, 0, 0.8), -1em 0.5em rgba(200, 0, 0, 0.8)",
    },
    "35%": {
      width: "2.5em",
      boxShadow:
        "0 -0.5em rgba(255, 0, 0, 0.9), 0 0.5em rgba(200, 0, 0, 0.9)",
    },
    "70%": {
      width: "0.5em",
      boxShadow:
        "-1em -0.5em rgba(255, 0, 0, 0.8), 1em 0.5em rgba(200, 0, 0, 0.8)",
    },
    "100%": {
      boxShadow:
        "1em -0.5em rgba(255, 0, 0, 0.8), -1em 0.5em rgba(200, 0, 0, 0.8)",
    },
  },

  "@keyframes afterRed": {
    "0%": {
      height: "0.5em",
      boxShadow:
        "0.5em 1em rgba(255, 50, 50, 0.8), -0.5em -1em rgba(200, 0, 0, 0.8)",
    },
    "35%": {
      height: "2.5em",
      boxShadow:
        "0.5em 0 rgba(255, 50, 50, 0.9), -0.5em 0 rgba(200, 0, 0, 0.9)",
    },
    "70%": {
      height: "0.5em",
      boxShadow:
        "0.5em -1em rgba(255, 50, 50, 0.8), -0.5em 1em rgba(200, 0, 0, 0.8)",
    },
    "100%": {
      boxShadow:
        "0.5em 1em rgba(255, 50, 50, 0.8), -0.5em -1em rgba(200, 0, 0, 0.8)",
    },
  },
});

const Loader: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
};

export default Loader;
