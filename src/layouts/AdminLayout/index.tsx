import Grid from "@mui/material/Grid";
import { Typography, Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const AdminLayout = () => {
  const auth = { token: true };

  if (!auth.token) {
    return <Navigate to="/" />;
  }

  return (
    <Box>
      <Navbar />
      <Grid container>
        <Grid size="auto" sx={{ width: "250px" }}>
          <Box sx={{ height: "100vh" }}>
            <Typography>Sidebar</Typography>
          </Box>
        </Grid>
        <Grid size="grow">
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminLayout;
