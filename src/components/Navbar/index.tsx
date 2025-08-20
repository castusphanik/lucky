import { Button, Box } from "@mui/material";
import type { RootState } from "../../redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features/theme/themeSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.value);
  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(toggleTheme(theme === "dark" ? "light" : "dark"));
        }}
      >
        Toggle {theme === "dark" ? "Light" : "Dark"} Mode
      </Button>
    </Box>
  );
};

export default Navbar;
